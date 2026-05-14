const logoUrl = "https://support-hub.io/assets/img/logo_text.svg"; 

export const buildPaymentCompletedHtml = (
  userEmail: string,
  orgName: string,
  transactionId: string
): string => {
  const displayName = userEmail.split('@')[0];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #10B981;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #0F172A; font-size: 24px;">Payment Successful 🎉</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${displayName}</strong>,<br><br>
                    We have successfully received the payment for your organization <strong>${orgName}</strong>. Your Premium features are active and ready to use.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px;">
                          <strong>Transaction ID:</strong> 
                          <span style="color: #334155;">${transactionId}</span>
                        </p>
                        <p style="margin: 0; font-size: 16px;">
                          <strong>Status:</strong> 
                          <span style="color: #10B981; font-weight: bold;">PAID</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                    You can download your full invoice from the Billing section in your SupportHub dashboard.
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

export const buildPaymentFailedHtml = (
  userEmail: string,
  orgName: string,
  transactionId: string,
  errorMessage: string
): string => {
  const displayName = userEmail.split('@')[0];
  const billingUrl = `https://support-hub.io/dashboard/billing`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
              
              <tr>
                <td align="center" style="padding: 24px; background-color: #0F172A; border-bottom: 4px solid #EF4444;">
                  <img src="${logoUrl}" alt="SupportHub Logo" width="200" style="display: block; border: 0; max-width: 100%; height: auto;" />
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #334155;">
                  <h2 style="margin: 0 0 20px; color: #EF4444; font-size: 24px;">Payment Failed ⚠️</h2>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${displayName}</strong>,<br><br>
                    We were unable to process the latest payment for your organization <strong>${orgName}</strong>. 
                    Please update your payment method to avoid any interruption to your SupportHub services.
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; margin: 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #991B1B; text-transform: uppercase; letter-spacing: 0.5px;">Error Details</p>
                        
                        <p style="margin: 0 0 10px; font-size: 16px; color: #7F1D1D;">
                          <strong>Reason:</strong> ${errorMessage}
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #7F1D1D;">
                          Transaction ID: ${transactionId}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${billingUrl}" target="_blank" style="display: inline-block; background-color: #0F172A; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                          Update Payment Method
                        </a>
                      </td>
                    </tr>
                  </table>

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