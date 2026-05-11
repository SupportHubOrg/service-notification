import { mailer } from "../config/mailer";
import { buildTicketCreatedHtml } from "../templates/ticketTemplates";

export const sendTicketConfirmation = async (userEmail: string, title: string, ticketId: string): Promise<boolean> => {
  try {
    const subject = `New Ticket Created: ${title}`;
    const htmlContent = buildTicketCreatedHtml(title, ticketId);

    await mailer.sendMail(userEmail, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error while sending email to ${userEmail}:`, error);
    return false;
  }
};