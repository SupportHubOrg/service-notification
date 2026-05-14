import "dotenv/config";
import { consumer, producer } from "./config/kafkaClient";
import { prisma } from "./db/prisma";
import { readEvents } from "./kafka/consumer";

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