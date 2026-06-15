import { TicketCreatedEvent, TicketMessageAddedEvent, TicketStatusChangedEvent } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getCreatorIdByTicketId, getEmailByUserId, getOrganizationNameByOrgId } from "../services/cacheService";
import { sendTicketConfirmation, sendTicketMessageEmail, sendTicketStatusEmail } from "../services/emailService";

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
    const emailSuccess = await sendTicketConfirmation(email, subject, ticketId);

    if (emailSuccess) {
      await publishNotificationReport("NotificationSent", "Success", email);
    } else {
      await publishNotificationReport("NotificationFailed", "SMTP_Transport_Error", email);
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


export const handleTicketMessageAdded = async (rawEvent: any) => {
  const messageEvent = rawEvent as TicketMessageAddedEvent;
  const { organizationId, ticketId, senderType, message } = messageEvent.payload;

  if (senderType === 'Employee') {
    console.log(`Message in ticket ${ticketId} added by Employee. Skipping email notification.`);
    return;
  }

  const creatorId = await getCreatorIdByTicketId(ticketId);

  if (!creatorId) {
    console.error(`Creator ID for ticket ${ticketId} not found in cache. Cannot send TicketMessageAdded.`);
    await publishNotificationReport("TicketMessageNotificationFailed", "TicketNotFound", "unknown");
    return;
  }

  const userEmail = await getEmailByUserId(creatorId);
  const orgName = await getOrganizationNameByOrgId(organizationId);

  if (userEmail) {
    try {
      const senderName = senderType === 'AI' ? 'AI Assistant' : 'Support Operator';
      
      await sendTicketMessageEmail(userEmail, ticketId, orgName || "Organization", senderName, message);
      await publishNotificationReport("TicketMessageNotificationSent", "Success", userEmail);
    } catch (err) {
      await publishNotificationReport("TicketMessageNotificationFailed", "Error", userEmail);
    }
  } else {
    console.error(`Email for user ${creatorId} not found in cache.`);
    await publishNotificationReport("TicketMessageNotificationFailed", "UserNotFound", "unknown");
  }
};