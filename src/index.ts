import "dotenv/config";
import { execSync } from "child_process";
import { kafka, consumer, producer } from "./config/kafkaClient";
import { prisma } from "./db/prisma";
import { readEvents } from "./kafka/consumer";

async function ensureRequiredTopicsExist() {
  const admin = kafka.admin();
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await admin.connect();
      const existingTopics = await admin.listTopics();
      
      const requiredTopics = [
        process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events",
        process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events",
        process.env.KAFKA_TOPIC_READ_BILLING || "billing-events",
        process.env.KAFKA_TOPIC_WRITE || "notification-events"
      ];

      const topicsToCreate = requiredTopics
        .filter(topic => !existingTopics.includes(topic))
        .map(topic => ({ topic, numPartitions: 1, replicationFactor: 1 }));

      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate,
          waitForLeaders: true
        });
        console.log(`[Kafka Admin] Programmatically provisioned required topics: ${topicsToCreate.map(t => t.topic).join(", ")}`);
      } else {
        console.log("[Kafka Admin] All required infrastructure topics are present on the broker.");
      }
      
      await admin.disconnect();
      return;
    } catch (error: any) {
      attempt++;
      console.warn(`[Kafka Admin] Connection attempt ${attempt} failed (Transient Broker Sync). Retrying in 3s... Error: ${error.message}`);
      try { await admin.disconnect(); } catch { /* ignore secondary disconnect errors */ }
      
      if (attempt >= maxRetries) {
        console.error("[Kafka Admin] Fatal error verifying or establishing application topics:", error);
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

const run = async () => {
  console.log("[Prisma] Pushing structural schema definitions to NotificationDb...");
  execSync("npx prisma db push --accept-data-loss --skip-generate", { stdio: "inherit" });
  console.log("[Prisma] Database tables aligned successfully.");

  await ensureRequiredTopicsExist();

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