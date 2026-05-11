export const buildOrganizationCreatedHtml = (managerName: string, organizationName: string, loginUrl: string): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SupportHub</title>
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
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Welcome to SupportHub, ${managerName}!</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Thank you for choosing our platform. Your payment has been successfully processed, and your organization's workspace is now fully active and ready to use.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Workspace Details</p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Organization:</strong> 
                          <span style="color: #0F172A; font-weight: bold;">${organizationName}</span>
                        </p>
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Your Role:</strong> Organization Manager
                        </p>
                        <p style="margin: 0; font-size: 16px;">
                          <strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">Active</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                    Your next step is to log in to your dashboard, configure your settings, and invite your team members to join the workspace.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                          Go to Dashboard
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
                    If you have any questions, feel free to contact our support team at support@support-hub.io.
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