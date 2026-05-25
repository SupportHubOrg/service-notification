export const buildTicketCreatedHtml = (title: string, ticketId: string): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Created</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #3B82F6;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Your ticket has been created!</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Your request has been successfully registered in our system. Our support team has already started reviewing it.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Ticket Details</p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Ticket ID:</strong> 
                          <span style="color: #3B82F6; font-weight: bold;">#${ticketId}</span>
                        </p>
                        <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                          <strong>Subject:</strong> ${title}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                    We will notify you as soon as there is an update on your ticket status.
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0 0 10px;">Best regards,<br><strong style="color: #0F172A;">The SupportHub Team</strong></p>
                  <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                    This is an automated message, please do not reply to this email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};


export const buildTicketUpdateHtml = (
  userEmail: string,
  ticketId: string,
  oldStatus: string,
  newStatus: string,
  orgName: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  const displayName = userEmail.split('@')[0];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Status Updated</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #3B82F6;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Ticket Status Updated</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${displayName}</strong>,<br><br>
                    The status of your ticket associated with <strong>${orgName}</strong> has been updated by our support team.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Update Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Ticket ID:</strong> 
                          <span style="color: #3B82F6; font-weight: bold;">#${ticketId}</span>
                        </p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Previous Status:</strong> 
                          <span style="color: #94A3B8; text-decoration: line-through;">${oldStatus}</span>
                        </p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                          <strong>New Status:</strong> 
                          <span style="color: #10B981; font-weight: bold;">${newStatus}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                    You can view the full details and respond to this update by logging into your SupportHub dashboard.
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0 0 10px;">Best regards,<br><strong style="color: #0F172A;">The SupportHub Team</strong></p>
                  <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                    This is an automated message, please do not reply to this email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};


export const buildTicketMessageHtml = (
  userEmail: string,
  ticketId: string,
  orgName: string,
  senderName: string,
  messageText: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  const displayName = userEmail.split('@')[0];
  const ticketUrl = `https://support-hub.io/dashboard/tickets/${ticketId}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Ticket Message</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #3B82F6;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">New message on your ticket</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${displayName}</strong>,<br><br>
                    <strong>${senderName}</strong> has replied to your ticket <strong>#${ticketId}</strong> in <strong>${orgName}</strong>.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Message Preview</p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; font-style: italic; color: #334155; border-left: 4px solid #3B82F6; padding-left: 15px; background-color: #ffffff; padding-top: 10px; padding-bottom: 10px; padding-right: 10px; border-radius: 0 4px 4px 0;">
                          "${messageText}"
                        </p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${ticketUrl}" target="_blank" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                          View Ticket & Reply
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0 0 10px;">Best regards,<br><strong style="color: #0F172A;">The SupportHub Team</strong></p>
                  <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                    This is an automated message. You can reply directly in the SupportHub platform.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const buildSlaDeadlineHtml = (
  ticketId: string,
  organizationId: string,
  slaType: string,
  deadlineTime: string,
  minutesRemaining: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  const ticketUrl = `https://support-hub.io/dashboard/tickets/${ticketId}`;

  const formatSlaType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formattedDeadline = new Date(deadlineTime).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SLA Deadline Approaching</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #F59E0B;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #D97706; font-size: 24px;">SLA Deadline Approaching ⏳</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello Support Team,<br><br>
                    Action is required! A ticket is at risk of breaching its Service Level Agreement (SLA) in <strong>${minutesRemaining} minutes</strong>.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">Alert Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Ticket ID:</strong> 
                          <span style="color: #334155;">#${ticketId}</span>
                        </p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>SLA Type:</strong> 
                          <span style="color: #334155;">${formatSlaType(slaType)}</span>
                        </p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Time Remaining:</strong> 
                          <span style="color: #D97706; font-weight: bold;">${minutesRemaining} minutes</span>
                        </p>
                        <p style="margin: 0; font-size: 16px;">
                          <strong>Exact Deadline:</strong> 
                          <span style="color: #334155;">${formattedDeadline}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${ticketUrl}" target="_blank" style="display: inline-block; background-color: #F59E0B; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);">
                          Review Ticket Now
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                    This is an automated SLA monitoring alert from SupportHub.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const buildSlaDeadlineBreachedHtml = (
  ticketId: string,
  organizationId: string,
  slaType: string,
  deadlineTime: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg";
  const ticketUrl = `https://support-hub.io/dashboard/tickets/${ticketId}`;

  const formatSlaType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formattedDeadline = new Date(deadlineTime).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SLA Deadline Breached</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #DC2626;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #DC2626; font-size: 24px;">SLA Deadline Breached</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello Support Team,<br><br>
                    A ticket has <strong>breached</strong> its Service Level Agreement (SLA). Immediate action is required.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #B91C1C; text-transform: uppercase; letter-spacing: 0.5px;">Breach Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Ticket ID:</strong> 
                          <span style="color: #334155;">#${ticketId}</span>
                        </p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Organization ID:</strong> 
                          <span style="color: #334155;">${organizationId}</span>
                        </p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>SLA Type:</strong> 
                          <span style="color: #334155;">${formatSlaType(slaType)}</span>
                        </p>
                        <p style="margin: 0; font-size: 16px;">
                          <strong>Deadline:</strong> 
                          <span style="color: #DC2626; font-weight: bold;">${formattedDeadline}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${ticketUrl}" target="_blank" style="display: inline-block; background-color: #DC2626; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);">
                          Review Ticket Now
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                    This is an automated SLA breach alert from SupportHub.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};