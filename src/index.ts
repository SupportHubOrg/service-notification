import "dotenv/config";
import { kafka, consumer, producer } from "./config/kafkaClient";
import { prisma } from "./db/prisma";
import { readEvents } from "./kafka/consumer";

const createKafkaTopics = async () => {
  try {
    const adminClient = kafka.admin();
    await adminClient.connect();
    
    const existingTopics = await adminClient.fetchTopicMetadata();
    const existingTopicNames = new Set(existingTopics.topics.map((t: any) => t.name));

    const topicsNeeded = [
      process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events",
      process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events",
      process.env.KAFKA_TOPIC_WRITE || "notification-events",
      process.env.KAFKA_TOPIC_READ_BILLING || "billing-events",
    ];

    const topicsToCreate = topicsNeeded
      .filter(topic => !existingTopicNames.has(topic))
      .map(topic => ({ topic, numPartitions: 1, replicationFactor: 1 }));

    if (topicsToCreate.length > 0) {
      await adminClient.createTopics({ topics: topicsToCreate, validateOnly: false });
      console.log("Topics created:", topicsToCreate.map((t: any) => t.topic).join(", "));
    }

    await adminClient.disconnect();
  } catch (error) {
    console.log("Topics already exist or could not be created:", error);
  }
};

const run = async () => {
  await createKafkaTopics();

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