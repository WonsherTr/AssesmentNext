import nodemailer from 'nodemailer';
import { ITicket, IUserResponse, IComment } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"HelpDeskPro" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendTicketCreatedEmail(
  user: IUserResponse,
  ticket: ITicket
): Promise<boolean> {
  const subject = `[HelpDeskPro] Ticket Created: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Ticket Created Successfully</h2>
      <p>Hello ${user.name},</p>
      <p>Your support ticket has been created successfully.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">${ticket.title}</h3>
        <p style="color: #6b7280;">${ticket.description}</p>
        <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
        <p><strong>Status:</strong> ${ticket.status.replace('_', ' ').toUpperCase()}</p>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
      </div>
      
      <p>Our support team will review your ticket and respond as soon as possible.</p>
      
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated message from HelpDeskPro. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendTicketCommentEmail(
  user: IUserResponse,
  ticket: ITicket,
  comment: IComment,
  commenterName: string
): Promise<boolean> {
  const subject = `[HelpDeskPro] New Response on Ticket: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Response on Your Ticket</h2>
      <p>Hello ${user.name},</p>
      <p>There is a new response on your support ticket.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">${ticket.title}</h3>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p><strong>Current Status:</strong> ${ticket.status.replace('_', ' ').toUpperCase()}</p>
      </div>
      
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin-top: 0;"><strong>${commenterName} wrote:</strong></p>
        <p style="color: #1f2937;">${comment.message}</p>
      </div>
      
      <p>Log in to your dashboard to view the full conversation and respond.</p>
      
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated message from HelpDeskPro. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendTicketClosedEmail(
  user: IUserResponse,
  ticket: ITicket
): Promise<boolean> {
  const subject = `[HelpDeskPro] Ticket Closed: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Ticket Closed</h2>
      <p>Hello ${user.name},</p>
      <p>Your support ticket has been closed.</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">${ticket.title}</h3>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p><strong>Final Status:</strong> CLOSED</p>
      </div>
      
      <p>If you need further assistance, please create a new ticket.</p>
      
      <p>Thank you for using HelpDeskPro!</p>
      
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated message from HelpDeskPro. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendTicketReminderEmail(
  agentEmail: string,
  agentName: string,
  tickets: ITicket[]
): Promise<boolean> {
  const subject = `[HelpDeskPro] Reminder: ${tickets.length} Tickets Need Attention`;
  
  const ticketList = tickets.map(t => `
    <li style="margin-bottom: 10px;">
      <strong>${t.title}</strong><br/>
      <span style="color: #6b7280;">Priority: ${t.priority.toUpperCase()} | Status: ${t.status.replace('_', ' ').toUpperCase()}</span>
    </li>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Ticket Reminder</h2>
      <p>Hello ${agentName},</p>
      <p>The following tickets require your attention:</p>
      
      <ul style="background-color: #fffbeb; padding: 20px 20px 20px 40px; border-radius: 8px; margin: 20px 0;">
        ${ticketList}
      </ul>
      
      <p>Please log in to your agent dashboard to review and respond to these tickets.</p>
      
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated message from HelpDeskPro. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail({ to: agentEmail, subject, html });
}

export default sendEmail;
