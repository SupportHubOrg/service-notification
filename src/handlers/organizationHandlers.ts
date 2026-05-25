import { OrganizationCreatedEvent, SlaDeadlineApproachingEvent, SlaDeadlineBreachedEvent } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getEmailByUserId } from "../services/cacheService";
import { sendOrgCreationConfirmation, sendSlaDeadlineApproaching, sendSlaDeadlineBreached } from "../services/emailService";

export const handleOrganizationCreated = async (rawEvent: any) => {
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


export const handleSlaDeadlineApproaching = async (rawEvent: any) => {
  const slaEvent = rawEvent as SlaDeadlineApproachingEvent;
  const { ticketId, organizationId, slaType, deadlineTime, minutesRemaining } = slaEvent.payload;
  const supportEmail = process.env.SupportTeamEmail;

  if (!supportEmail) {
    console.error(`[SLA Handler] SupportTeamEmail is not defined in environment variables.`);
    await publishNotificationReport("SlaNotificationFailed", "ConfigError", "missing_env");
    return;
  }

  try {
    const success = await sendSlaDeadlineApproaching(
      ticketId,
      organizationId,
      slaType,
      deadlineTime,
      minutesRemaining.toString()
    );

    if (success) {
      console.log(`[SLA Handler] Warning sent for ticket: ${ticketId}`);
      await publishNotificationReport("SlaDeadlineWarningSent", "Success", supportEmail);
    } else {
      throw new Error("SMTP transport failed");
    }

  } catch (err) {
    console.error(`[SLA Handler] Failed to send warning for ticket ${ticketId}:`, err);
    await publishNotificationReport("SlaDeadlineWarningFailed", "Error", supportEmail);
  }
};

export const handleSlaDeadlineBreached = async (rawEvent: any) => {
  const slaEvent = rawEvent as SlaDeadlineBreachedEvent;
  const { ticketId, organizationId, slaType, deadlineTime } = slaEvent.payload;
  const supportEmail = process.env.SupportTeamEmail;

  if (!supportEmail) {
    console.error(`[SLA Breach Handler] SupportTeamEmail is not defined in environment variables.`);
    await publishNotificationReport("SlaBreachNotificationFailed", "ConfigError", "missing_env");
    return;
  }

  try {
    const success = await sendSlaDeadlineBreached(
      ticketId,
      organizationId,
      slaType,
      deadlineTime
    );

    if (success) {
      console.log(`[SLA Breach Handler] Breach alert sent for ticket: ${ticketId}`);
      await publishNotificationReport("SlaDeadlineBreachSent", "Success", supportEmail);
    } else {
      throw new Error("SMTP transport failed");
    }
  } catch (err) {
    console.error(`[SLA Breach Handler] Failed to send breach alert for ticket ${ticketId}:`, err);
    await publishNotificationReport("SlaDeadlineBreachFailed", "Error", supportEmail);
  }
};
