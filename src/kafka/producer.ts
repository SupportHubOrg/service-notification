import { producer } from "../config/kafkaClient";

export const publishNotificationReport = async (eventType: string, status: string, userEmail: string) => {
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