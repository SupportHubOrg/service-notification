import { TicketCreatedEvent, TicketStatusChangedEvent } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getCreatorIdByTicketId, getEmailByUserId, getOrganizationNameByOrgId } from "../services/cacheService";
import { sendTicketConfirmation, sendTicketStatusEmail } from "../services/emailService";

export const handleTicketCreated = async (rawEvent: any) => {
  const ticketEvent = rawEvent as TicketCreatedEvent;
  const { creatorId, subject, ticketId } = ticketEvent.payload;

  await prisma.ticketCache.upsert({
    where: { ticketId: ticketId },
    update: { creatorId: creatorId },
    create: { ticketId: ticketId, creatorId: creatorId },
  });
  console.log(`Cached creator data for ticket: ${ticketId}`);

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

export const handleTicketStatusChanged = async (rawEvent: any) => {
  const statusEvent = rawEvent as TicketStatusChangedEvent; 
  const { organizationId, ticketId, oldStatus, newStatus } = statusEvent.payload;

  const creatorId = await getCreatorIdByTicketId(ticketId);

  if (!creatorId) {
    console.error(`Creator ID for ticket ${ticketId} not found in cache. Cannot send status update.`);
    await publishNotificationReport("TicketStatusNotificationFailed", "TicketNotFound", "unknown");
    return;
  }

  const userEmail = await getEmailByUserId(creatorId);
  const orgName = await getOrganizationNameByOrgId(organizationId);

  if (userEmail) {
    try {
      await sendTicketStatusEmail(userEmail, ticketId, oldStatus, newStatus, orgName || "Organization");
      await publishNotificationReport("TicketStatusNotificationSent", "Success", userEmail);
    } catch (err) {
      await publishNotificationReport("TicketStatusNotificationFailed", "Error", userEmail);
    }
  } else {
    console.error(`Email for user ${creatorId} not found in cache.`);
    await publishNotificationReport("TicketStatusNotificationFailed", "UserNotFound", "unknown");
  }
};