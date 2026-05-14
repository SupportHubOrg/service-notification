import { mailer } from "../config/mailer";
import { OrganizationTier } from "../contracts/events";
import { buildTicketCreatedHtml, buildTicketUpdateHtml } from "../templates/ticketTemplates";
import { buildOrganizationCreatedHtml, buildOrganizationInviteHtml } from "../templates/userTemplates";

export const sendTicketConfirmation = async (userEmail: string, title: string, ticketId: string): Promise<boolean> => {
  try {
    const subject = `New Ticket Created: ${title}`;
    const htmlContent = buildTicketCreatedHtml(title, ticketId);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending sendTicketConfirmation email to ${userEmail}:`, error);
    return false;
  }
};


export const sendOrgCreationConfirmation = async (userEmail: string, organizationName: string, organizationId: string, tier:OrganizationTier): Promise<boolean> => {
  try {
    const subject = `New Organization Created: ${organizationName}`;
    const htmlContent = buildOrganizationCreatedHtml(userEmail, organizationName,organizationId,tier);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending sendOrgCreationConfirmation email to ${userEmail}:`, error);
    return false;
  }
};


export const sendUserInvitationEmail = async (userEmail:string, orgName:string, targetRole:string, invitationLink:string): Promise<boolean> => {
  try {
    const subject = `New Organization Invite: ${orgName}`;
    const htmlContent = buildOrganizationInviteHtml(userEmail, orgName,targetRole, invitationLink);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending sendUserInvitationEmail email to ${userEmail}:`, error);
    return false;
  }
}

export const sendTicketStatusEmail = async (userEmail:string, ticketId:string, oldStatus:string, newStatus:string, orgName:string): Promise<boolean> => {
  try {
    const subject = `[SupportHub] Ticket #${ticketId} Status Updated - ${orgName}`;
    const htmlContent = buildTicketUpdateHtml(userEmail, ticketId, oldStatus, newStatus, orgName);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending sendUserInvitationEmail email to ${userEmail}:`, error);
    return false;
  }
}