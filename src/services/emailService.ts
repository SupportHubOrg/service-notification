import "dotenv/config";
import { mailer } from "../config/mailer";
import { OrganizationTier } from "../contracts/events";
import { buildPaymentCompletedHtml, buildPaymentFailedHtml } from "../templates/billingTemplates";
import { buildSlaDeadlineBreachedHtml, buildSlaDeadlineHtml, buildTicketCreatedHtml, buildTicketMessageHtml, buildTicketUpdateHtml } from "../templates/ticketTemplates";
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


export const sendTicketMessageEmail = async (
  userEmail: string, ticketId: string, orgName: string, senderName: string, message: string): Promise<boolean> => {
  try {
    const subject = `[SupportHub] New message in Ticket #${ticketId} - ${orgName}`;
    const htmlContent = buildTicketMessageHtml(userEmail, ticketId, orgName, senderName, message);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending ticket message email to ${userEmail}:`, error);
    return false;
  }
}


export const sendPaymentCompletedEmail = async (userEmail: string,orgName: string,transactionId: string): Promise<boolean> => {
  try {
    const subject = `[SupportHub] Payment Receipt: Thank you for your purchase - ${orgName}`;
    const htmlContent = buildPaymentCompletedHtml(userEmail, orgName, transactionId);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending payment completed email to ${userEmail}:`, error);
    return false;
  }
};

export const sendPaymentFailedEmail = async (userEmail: string,orgName: string,transactionId: string,errorMessage: string): Promise<boolean> => {
  try {
    const subject = `[SupportHub] Action Required: Payment Failed - ${orgName}`;
    const htmlContent = buildPaymentFailedHtml(userEmail, orgName, transactionId, errorMessage);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending payment failed email to ${userEmail}:`, error);
    return false;
  }
};


export const sendSlaDeadlineApproaching = async (ticketId: string,organizationId:string,slaType:string,deadlineTime:string,minutesRemaining:string): Promise<boolean> => {
try {
    const subject = `[SLA Warning] Ticket ${ticketId}: ${slaType} deadline in ${minutesRemaining}m`;

    const htmlContent = buildSlaDeadlineHtml(
      ticketId,
      organizationId,
      slaType,
      deadlineTime,
      minutesRemaining
    );

    const recipient = process.env.SupportTeamEmail || "";
    await mailer.sendMail(recipient, subject, htmlContent);
    
    return true;
  } catch (error) {
    console.error(`[Email Service] SLA Warning Error for Ticket ${ticketId}:`, error);
    return false;
  }
};

export const sendSlaDeadlineBreached = async (
  ticketId: string,
  organizationId: string,
  slaType: string,
  deadlineTime: string
): Promise<boolean> => {
  try {
    const subject = `[SLA Breached] Ticket ${ticketId}: ${slaType} deadline exceeded`;

    const htmlContent = buildSlaDeadlineBreachedHtml(
      ticketId,
      organizationId,
      slaType,
      deadlineTime
    );

    const recipient = process.env.SupportTeamEmail || "";
    await mailer.sendMail(recipient, subject, htmlContent);

    return true;
  } catch (error) {
    console.error(`[Email Service] SLA Breach Error for Ticket ${ticketId}:`, error);
    return false;
  }
};