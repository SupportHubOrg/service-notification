import { PaymentCompletedEvent, PaymentFailedEvent } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getEmailByUserId } from "../services/cacheService";
import { sendPaymentCompletedEmail, sendPaymentFailedEmail } from "../services/emailService";

async function getOrgData(organizationId: string) {
  return await prisma.orgCache.findUnique({
    where: { organizationId },
  });
}

export const handlePaymentCompleted = async (rawEvent: any) => {
  const event = rawEvent as PaymentCompletedEvent;
  const { organizationId, transactionId } = event.payload;

  const orgData = await getOrgData(organizationId);

  if (!orgData || !orgData.managerId) {
    console.error(`Organization ${organizationId} or its manager not found in cache.`);
    await publishNotificationReport("PaymentCompletedNotificationFailed", "OrgOrManagerNotFound", "unknown");
    return;
  }

  const managerEmail = await getEmailByUserId(orgData.managerId);

  if (managerEmail) {
    try {
      await sendPaymentCompletedEmail(managerEmail, orgData.organizationName, transactionId);
      await publishNotificationReport("PaymentCompletedNotificationSent", "Success", managerEmail);
    } catch (err) {
      await publishNotificationReport("PaymentCompletedNotificationFailed", "Error", managerEmail);
    }
  } else {
    console.error(`Email for manager ${orgData.managerId} not found in cache.`);
    await publishNotificationReport("PaymentCompletedNotificationFailed", "ManagerEmailNotFound", "unknown");
  }
};

export const handlePaymentFailed = async (rawEvent: any) => {
  const event = rawEvent as PaymentFailedEvent;
  const { organizationId, transactionId, errorMessage } = event.payload;

  const orgData = await getOrgData(organizationId);

  if (!orgData || !orgData.managerId) {
    console.error(`Organization ${organizationId} or its manager not found in cache.`);
    await publishNotificationReport("PaymentFailedNotificationFailed", "OrgOrManagerNotFound", "unknown");
    return;
  }

  const managerEmail = await getEmailByUserId(orgData.managerId);

  if (managerEmail) {
    try {
      await sendPaymentFailedEmail(managerEmail, orgData.organizationName, transactionId, errorMessage || "Card declined");
      await publishNotificationReport("PaymentFailedNotificationSent", "Success", managerEmail);
    } catch (err) {
      await publishNotificationReport("PaymentFailedNotificationFailed", "Error", managerEmail);
    }
  } else {
    console.error(`Email for manager ${orgData.managerId} not found in cache.`);
    await publishNotificationReport("PaymentFailedNotificationFailed", "ManagerEmailNotFound", "unknown");
  }
};