import { NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { Ticket, User, Comment } from '@/models';
import { sendTicketReminderEmail } from '@/utils/email';
import { IApiResponse, ITicket } from '@/types';

// This endpoint can be called by a cron job service like Vercel Cron, AWS Lambda, etc.
// GET /api/cron/reminder - Check for tickets without response and send reminders
export async function GET(request: Request) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find tickets that are open or in_progress and haven't been updated in 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const staleTickets = await Ticket.find({
      status: { $in: ['open', 'in_progress'] },
      updatedAt: { $lt: oneDayAgo },
    }).populate('createdBy', 'name email role');

    if (staleTickets.length === 0) {
      return NextResponse.json<IApiResponse<{ message: string }>>(
        { success: true, data: { message: 'No stale tickets found' } },
        { status: 200 }
      );
    }

    // Group tickets by assigned agent (or send to all agents if unassigned)
    const agents = await User.find({ role: 'agent' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ticketsByAgent: Map<string, any[]> = new Map();

    for (const ticket of staleTickets) {
      // Check if ticket has any comments
      const commentCount = await Comment.countDocuments({ ticketId: ticket._id });
      
      if (commentCount === 0 || ticket.status === 'open') {
        const assignedTo = ticket.assignedTo?.toString();
        
        if (assignedTo) {
          const existing = ticketsByAgent.get(assignedTo) || [];
          existing.push(ticket);
          ticketsByAgent.set(assignedTo, existing);
        } else {
          // Unassigned tickets - notify all agents
          for (const agent of agents) {
            const existing = ticketsByAgent.get(agent._id.toString()) || [];
            existing.push(ticket);
            ticketsByAgent.set(agent._id.toString(), existing);
          }
        }
      }
    }

    // Send reminder emails to agents
    let emailsSent = 0;
    const entries: [string, unknown[]][] = Array.from(ticketsByAgent.entries());
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const agentId = entry[0];
      const agentTickets = entry[1];
      const agent = agents.find((a: { _id: { toString: () => string }; email: string; name: string }) => a._id.toString() === agentId);
      if (agent && agentTickets.length > 0) {
        const ticketObjects = agentTickets.map((t: unknown) => {
          const ticket = t as { toObject: () => ITicket };
          return ticket.toObject();
        });
        const sent = await sendTicketReminderEmail(
          agent.email,
          agent.name,
          ticketObjects
        );
        if (sent) emailsSent++;
      }
    }

    return NextResponse.json<IApiResponse<{ ticketsFound: number; emailsSent: number }>>(
      { 
        success: true, 
        data: { 
          ticketsFound: staleTickets.length, 
          emailsSent 
        },
        message: `Processed ${staleTickets.length} stale tickets, sent ${emailsSent} reminder emails`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while processing reminders' },
      { status: 500 }
    );
  }
}
