import "dotenv/config";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class MailerConfig {
  private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.NODEMAILER_PORT) || 2525,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    } as SMTPTransport.Options);
  }

  async sendMail(to: string, subject: string, htmlContent: string) {
    const sender = {
      address: "supporthub@gmail.com",
      name: "SupportHub Team",
    };

    try {
      const info = await this.transport.sendMail({
        from: sender,
        to: to,
        subject: subject,
        html: htmlContent,
      });

      console.log(`Email sent successfully to ${to} (ID: ${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }
}

export const mailer = new MailerConfig();