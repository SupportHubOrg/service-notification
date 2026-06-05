import "dotenv/config";
import { Kafka } from "kafkajs";
import { TicketCreatedEvent } from "./contracts/events";
import { sendTicketConfirmation } from "./services/emailService";
import { prisma } from "./db/prisma";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER || process.env.ConnectionStrings__kafka || "localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || "notification-group",
});

const producer = kafka.producer();

async function getEmailByUserId(userId: string): Promise<string | null> {
  const user = await prisma.userCache.findUnique({
    where: { userId },
  });
  return user ? user.email : null;
}

const publishNotificationReport = async (eventType: string, status: string, userEmail: string) => {
  const reportPayload = {
    metadata: {
      eventType: eventType,
      timestamp: new Date().toISOString()
    },
    payload: {
      targetEmail: userEmail,
      status: status
    }
  };

  await producer.send({
    topic: process.env.KAFKA_TOPIC_WRITE || "notification-events",
    messages: [
      { value: JSON.stringify(reportPayload) }
    ],
  });
  console.log(`Report published: ${eventType} for ${userEmail}`);
};

const readEvents = async () => {
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events", fromBeginning: false });
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events", fromBeginning: false });

  console.log(`Successfully listening to topics: ${process.env.KAFKA_TOPIC_READ_TICKET}, ${process.env.KAFKA_TOPIC_READ_ORG}`);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const rawEvent = JSON.parse(message.value.toString());

        if (!rawEvent?.metadata?.eventType || !rawEvent?.payload) {
          console.warn(`[${topic}] Ignoring bad structure message.`);
          return;
        }

        const eventType = rawEvent.metadata.eventType;
        console.log(`\n Get Event: ${eventType} from topic: ${topic}`);

        switch (eventType) {
          case "UserInvitationAccepted": {
            const { userId, userEmail } = rawEvent.payload;

            await prisma.userCache.upsert({
              where: { userId: userId },
              update: { email: userEmail },
              create: { userId: userId, email: userEmail },
            });
            
            console.log(`Cached email for user: ${userId}`);
            break;
          }

          case "TicketCreated": {
            const ticketEvent = rawEvent as TicketCreatedEvent;
            const { userId, title, ticketId } = ticketEvent.payload;

            const email = await getEmailByUserId(userId);

            if (email) {
              try {
                await sendTicketConfirmation(email, title, ticketId);
                await publishNotificationReport("NotificationSent", "Success", email);
              } catch (err) {
                await publishNotificationReport("NotificationFailed", "Error", email);
              }
            } else {
              console.error(`Email for user ${userId} not found in cache.`);
              await publishNotificationReport("NotificationFailed", "UserNotFound", "unknown");
            }
            break;
          }

          case "OrganizationCreated": {
            break;
          }

          case "UserInvitationCreated": {
            break;
          }

          default: {
            console.log(`Event ${eventType} does not require email notification, skipping.`);
            break;
          }
        }

      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

const createKafkaTopics = async () => {
  try {
    const adminClient = kafka.admin();
    await adminClient.connect();
    
    const existingTopics = await adminClient.fetchTopicMetadata();
    const existingTopicNames = new Set(existingTopics.topics.map(t => t.name));

    const topicsNeeded = [
      process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events",
      process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events",
      process.env.KAFKA_TOPIC_WRITE || "notification-events",
    ];

    const topicsToCreate = topicsNeeded
      .filter(topic => !existingTopicNames.has(topic))
      .map(topic => ({ topic, numPartitions: 1, replicationFactor: 1 }));

    if (topicsToCreate.length > 0) {
      await adminClient.createTopics({ topics: topicsToCreate, validateOnly: false });
      console.log("Topics created:", topicsToCreate.map(t => t.topic).join(", "));
    }

    await adminClient.disconnect();
  } catch (error) {
    console.log("Topics already exist or could not be created:", error);
  }
};

const run = async () => {
  createKafkaTopics();

  await producer.connect();
  console.log("Producer Connected Successfully");
  await consumer.connect();
  console.log("Consumer Connected Successfully");

  await readEvents(); 
};

run().catch(console.error);