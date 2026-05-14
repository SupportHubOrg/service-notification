import { consumer } from "../config/kafkaClient";
import { handleOrganizationCreated } from "../handlers/organizationHandlers";
import { handleTicketCreated, handleTicketStatusChanged } from "../handlers/ticketHandlers";
import { handleUserInvitationAccepted, handleUserInvitationCreated } from "../handlers/userHandlers";

export const readEvents = async () => {
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
        console.log(`\nGet Event: ${eventType} from topic: ${topic}`);

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
          case "TicketStatusChanged":
            await handleTicketStatusChanged(rawEvent);
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