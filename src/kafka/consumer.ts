import { consumer } from "../config/kafkaClient";
import { handlePaymentCompleted, handlePaymentFailed } from "../handlers/billingHandlers";
import { handleOrganizationCreated, handleSlaDeadlineApproaching, handleSlaDeadlineBreached, handleOrganizationRegistered } from "../handlers/organizationHandlers";
import { handleTicketCreated, handleTicketMessageAdded, handleTicketStatusChanged } from "../handlers/ticketHandlers";
import { handleUserInvitationAccepted, handleUserInvitationCreated } from "../handlers/userHandlers";
import { processIdempotently } from "../services/idempotencyService";

const HANDLED_EVENT_TYPES = new Set([
  "UserInvitationAccepted",
  "TicketCreated",
  "OrganizationRegistered",
  "OrganizationCreated",
  "UserInvitationCreated",
  "TicketStatusChanged",
  "TicketMessageAdded",
  "PaymentCompleted",
  "PaymentFailed",
  "SlaDeadlineApproaching",
  "SlaDeadlineBreached",
]);

export const readEvents = async () => {
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_TICKET || "ticket-management-events", fromBeginning: true });
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_ORG || "organization-access-events", fromBeginning: true });
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_READ_BILLING || "billing-events", fromBeginning: true });

  console.log(`Successfully listening to topics: ${process.env.KAFKA_TOPIC_READ_TICKET}, ${process.env.KAFKA_TOPIC_READ_ORG}, ${process.env.KAFKA_TOPIC_READ_BILLING}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const rawEvent = JSON.parse(message.value.toString());

      if (!rawEvent?.metadata?.eventType || !rawEvent?.payload) {
        console.warn(`[${topic}] Ignoring bad structure message.`);
        return;
      }

      const eventType = rawEvent.metadata.eventType as string;
      const payload = rawEvent.payload as Record<string, unknown>;
      const offset = message.offset;

      console.log(`\nGet Event: ${eventType} from topic: ${topic} (partition=${partition}, offset=${offset})`);

      if (!HANDLED_EVENT_TYPES.has(eventType)) {
        console.log(`Event ${eventType} does not require email notification, skipping.`);
        return;
      }

      const kafkaContext = {
        topic,
        partition,
        offset,
        eventType,
        payload,
      };

      const runHandler = async (): Promise<void> => {
        switch (eventType) {
          case "UserInvitationAccepted":
            await handleUserInvitationAccepted(payload);
            break;
          case "TicketCreated":
            await handleTicketCreated(rawEvent);
            break;
          case "OrganizationRegistered":
            await handleOrganizationRegistered(rawEvent);
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
          case "TicketMessageAdded":
            await handleTicketMessageAdded(rawEvent);
            break;
          case "PaymentCompleted":
            await handlePaymentCompleted(rawEvent);
            break;
          case "PaymentFailed":
            await handlePaymentFailed(rawEvent);
            break;
          case "SlaDeadlineApproaching":
            await handleSlaDeadlineApproaching(rawEvent);
            break;
          case "SlaDeadlineBreached":
            await handleSlaDeadlineBreached(rawEvent);
            break;
        }
      };

      try {
        await processIdempotently(kafkaContext, runHandler);
      } catch (error) {
        console.error(`Error processing ${eventType} (offset=${offset}):`, error);
        throw error;
      }
    },
  });
};
