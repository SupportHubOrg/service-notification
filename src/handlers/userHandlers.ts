import { UserInvitationCreated } from "../contracts/events";
import { prisma } from "../db/prisma";
import { publishNotificationReport } from "../kafka/producer";
import { getOrganizationNameByOrgId } from "../services/cacheService";
import { sendUserInvitationEmail } from "../services/emailService";

export const handleUserInvitationAccepted = async (payload: any) => {
  const { userId, userEmail } = payload;
  await prisma.userCache.upsert({
    where: { userId },
    update: { email: userEmail },
    create: { userId, email: userEmail },
  });
  console.log(`Cached email for user: ${userId}`);
};

export const handleUserInvitationCreated = async (rawEvent: any) => {
  const userInviteEvent = rawEvent as UserInvitationCreated;
  const { organizationId, userId, userEmail, targetRole, invitationToken } = userInviteEvent.payload;

  const orgName = await getOrganizationNameByOrgId(organizationId);
  const invitationLink = `http://localhost:5173/invite?userId=${userId}&token=${invitationToken}&email=${encodeURIComponent(userEmail)}`;

  if (orgName && userEmail) {
    try {
      await sendUserInvitationEmail(userEmail, orgName, targetRole, invitationLink);
      await publishNotificationReport("UserInvitationSent", "Success", userEmail);
    } catch (err) {
      await publishNotificationReport("UserInvitationSentFailed", "Error", userEmail);
    }
  } else {
    console.error(`Missing data for UserInvitationCreated. orgName exists: ${!!orgName}, userEmail exists: ${!!userEmail}`);
    await publishNotificationReport("UserInvitationSentFailed", "MissingData", "unknown");
  }
};