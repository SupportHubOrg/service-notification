import { OrganizationTier } from "../contracts/events";

export const buildOrganizationRegisteredHtml = (
  managerEmail: string, 
  organizationName: string, 
  confirmationLink: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  const displayName = managerEmail.split('@')[0];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Organization</title>
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
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Action Required, ${displayName}!</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    You have successfully registered the organization <strong>${organizationName}</strong>. 
                    Before you can start using it, please confirm your email address and activate your workspace.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${confirmationLink}" target="_blank" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                          Confirm Organization
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 0; font-size: 14px; color: #64748B; text-align: center;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${confirmationLink}" style="color: #3B82F6; text-decoration: underline; word-break: break-all;">${confirmationLink}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 30px; background-color: #F1F5F9; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0;">
                  <p style="margin: 0 0 10px;">Best regards,<br><strong style="color: #0F172A;">The SupportHub Team</strong></p>
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

export const buildOrganizationCreatedHtml = (
  userEmail: string, 
  organizationName: string, 
  organizationId: string, 
  tier: OrganizationTier 
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  
  const displayName = userEmail.split('@')[0];
  
  const dashboardUrl = `https://support-hub.io/dashboard/${organizationId}`;
  
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
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Welcome to SupportHub, ${displayName}!</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Thank you for choosing our platform. Your workspace has been successfully provisioned and is now fully active and ready to use.
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
                          <strong>Organization ID:</strong> 
                          <span style="color: #475569;">${organizationId}</span>
                        </p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Subscription Tier:</strong> 
                          <span style="color: #3B82F6; font-weight: bold;">${tier}</span>
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
                        <a href="${dashboardUrl}" target="_blank" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
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


export const buildOrganizationInviteHtml = (
  userEmail: string, 
  orgName: string, 
  targetRole: string, 
  invitationLink: string
): string => {
  const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 
  
  const displayName = userEmail.split('@')[0];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to join SupportHub</title>
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
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Hello, ${displayName}!</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    You have been invited to join a workspace on SupportHub. We are excited to have you on board!
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Invitation Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Organization:</strong> 
                          <span style="color: #0F172A; font-weight: bold;">${orgName}</span>
                        </p>
                        
                        <p style="margin: 0; font-size: 16px;">
                          <strong>Your Role:</strong> 
                          <span style="color: #3B82F6; font-weight: bold;">${targetRole}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                    To accept this invitation and activate your account within the organization, please click the button below. This link is secure and unique to your email address.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${invitationLink}" target="_blank" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                          Accept Invitation
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
                    If you did not expect this invitation, you can safely ignore this email. For assistance, contact support@support-hub.io.
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