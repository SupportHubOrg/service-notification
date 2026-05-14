import { OrganizationCreatedEvent } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getEmailByUserId } from "../services/cacheService";
import { sendOrgCreationConfirmation } from "../services/emailService";

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