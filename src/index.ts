import "dotenv/config";
import { Kafka } from "kafkajs";
import { TicketCreatedEvent, OrganizationCreatedEvent, UserInvitationCreated } from "./contracts/events";
import { sendTicketConfirmation, sendOrgCreationConfirmation, sendUserInvitationEmail } from "./services/emailService";
import { prisma } from "./db/prisma";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || "notification-group",
});

const producer = kafka.producer();

async function getEmailByUserId(userId: string): Promise<string | null> {
  const user = await prisma.userCache.findUnique({
    where: { userId },
  });
  return user?.email || null;
}

async function getOrganizationNameByOrgId(organizationId: string): Promise<string | null> {
  const org = await prisma.orgCache.findUnique({
    where: { organizationId },
  });
  return org?.organizationName || null;
}

const publishNotificationReport = async (eventType: string, status: string, userEmail: string) => {
  const reportPayload = {
    metadata: {
      eventType,
      timestamp: new Date().toISOString()
    },
    payload: {
      targetEmail: userEmail,
      status
    }
  };

  await producer.send({
    topic: process.env.KAFKA_TOPIC_WRITE || "notification-events",
    messages: [{ value: JSON.stringify(reportPayload) }],
  });
  console.log(`Report published: ${eventType} for ${userEmail}`);
};

const handleUserInvitationAccepted = async (payload: any) => {
  const { userId, userEmail } = payload;
  await prisma.userCache.upsert({
    where: { userId },
    update: { email: userEmail },
    create: { userId, email: userEmail },
  });
  console.log(`Cached email for user: ${userId}`);
};

const handleTicketCreated = async (rawEvent: any) => {
  const ticketEvent = rawEvent as TicketCreatedEvent;
  const { creatorId, subject, ticketId } = ticketEvent.payload;
  const email = await getEmailByUserId(creatorId);

  if (email) {
    try {
      await sendTicketConfirmation(email, subject, ticketId);
      await publishNotificationReport("NotificationSent", "Success", email);
    } catch (err) {
      await publishNotificationReport("NotificationFailed", "Error", email);
    }
  } else {
    console.error(`Email for user ${creatorId} not found in cache.`);
    await publishNotificationReport("NotificationFailed", "UserNotFound", "unknown");
  }
};

const handleOrganizationCreated = async (rawEvent: any) => {
  const orgEvent = rawEvent as OrganizationCreatedEvent;
  const { organizationId, organizationName, tier, managerId } = orgEvent.payload;

  await prisma.orgCache.upsert({
    where: { organizationId },
    update: { organizationName, tier, managerId },
    create: { organizationId, organizationName, tier, managerId },
  });
  console.log(`Cached organization data for org: ${organizationId}`);

  const email = await getEmailByUserId(managerId);

  if (email) {
    try {
      await sendOrgCreationConfirmation(email, organizationName, organizationId, tier);
      await publishNotificationReport("NotificationOrgCreationSent", "Success", email);
    } catch (err) {
      await publishNotificationReport("NotificationOrgCreationSentFailed", "Error", email);
    }
  } else {
    console.error(`Email for user ${managerId} not found in cache.`);
    await publishNotificationReport("NotificationFailed", "UserNotFound", "unknown");
  }
};

const handleUserInvitationCreated = async (rawEvent: any) => {
  const userInviteEvent = rawEvent as UserInvitationCreated;
  const { organizationId, userEmail, targetRole, invitationToken } = userInviteEvent.payload;

  const orgName = await getOrganizationNameByOrgId(organizationId);
  const invitationLink = `https://support-hub.io/accept-invite?token=${invitationToken}&orgId=${organizationId}`;

  if (orgName && userEmail) {
    try {
      await sendUserInvitationEmail(userEmail, orgName, targetRole, invitationLink);
      await publishNotificationReport("UserInvitationSent", "Success", userEmail);
    } catch (err) {
      await publishNotificationReport("UserInvitationSentFailed", "Error", userEmail);
    }
  } else {
    console.error(`Missing data for UserInvitationCreated. orgName exists: ${!!orgName}, userEmail exists: ${!!userEmail}`);
    await publishNotificationReport("UserInvitationSentFailed", "MissingData", "unknown");
  }
};

const readEvents = async () => {
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events", fromBeginning: true });
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events", fromBeginning: true });

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
          case "UserInvitationAccepted":
            await handleUserInvitationAccepted(rawEvent.payload);
            break;
          case "TicketCreated":
            await handleTicketCreated(rawEvent);
            break;
          case "OrganizationCreated":
            await handleOrganizationCreated(rawEvent);
            break;
          case "UserInvitationCreated":
            await handleUserInvitationCreated(rawEvent);
            break;
          default:
            console.log(`Event ${eventType} does not require email notification, skipping.`);
            break;
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

const run = async () => {
  await producer.connect();
  console.log("Producer Connected Successfully");
  await consumer.connect();
  console.log("Consumer Connected Successfully");
  await readEvents();
};

const shutdown = async () => {
  console.log("\nGracefully shutting down...");
  try {
    await producer.disconnect();
    await consumer.disconnect();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

run().catch(console.error);