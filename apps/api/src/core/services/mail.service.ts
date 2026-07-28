import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    const fromName = process.env.SMTP_FROM_NAME || 'Patterns CMS';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@patterns.local';

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please go to ${resetUrl} to reset your password. This link will expire in 1 hour.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the button below to reset your password.</p>
            <p style="margin: 24px 0;">
              <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p style="font-size: 12px; color: #666;">This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      // Don't throw to prevent leaking email existence
    }
  }
}
