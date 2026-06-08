import { prisma } from "../db/prisma";

export async function getEmailByUserId(userId: string): Promise<string | null> {
  const user = await prisma.userCache.findUnique({
    where: { userId },
  });
  return user?.email || null;
}

export async function getOrganizationNameByOrgId(organizationId: string): Promise<string | null> {
  const org = await prisma.orgCache.findUnique({
    where: { organizationId },
  });
  return org?.organizationName || null;
}

export async function getCreatorIdByTicketId(ticketId: string): Promise<string | null> {
  const ticket = await prisma.ticketCache.findUnique({
    where: { ticketId },
  });
  return ticket?.creatorId || null;
}