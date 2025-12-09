import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { Comment, Ticket, User } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse, IComment, IUserResponse, ITicket } from '@/types';
import { sendTicketCommentEmail } from '@/utils/email';

// GET /api/comments?ticketId=xxx - Get comments for a ticket
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Check if user has access to the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Clients can only view comments on their own tickets
    if (payload.role === 'client' && ticket.createdBy.toString() !== payload.userId) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const comments = await Comment.find({ ticketId })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(
      { success: true, data: comments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while fetching comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { ticketId, message } = await request.json();

    // Validate input
    if (!ticketId || !message) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket ID and message are required' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Check if ticket exists and user has access
    const ticket = await Ticket.findById(ticketId).populate('createdBy', 'name email role');
    if (!ticket) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Clients can only comment on their own tickets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ticketCreatorId = (ticket.createdBy as any)?._id?.toString() || ticket.createdBy?.toString();
    if (payload.role === 'client' && ticketCreatorId !== payload.userId) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create comment
    const comment = await Comment.create({
      ticketId,
      author: payload.userId,
      message: message.trim(),
    });

    // Populate author for response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email role')
      .lean();

    // If agent is commenting, update ticket status to in_progress if it's open
    if (payload.role === 'agent' && ticket.status === 'open') {
      await Ticket.findByIdAndUpdate(ticketId, { status: 'in_progress' });
    }

    // Send email notification to the ticket creator if someone else comments
    if (ticketCreatorId !== payload.userId) {
      const commenter = await User.findById(payload.userId);
      const creator = ticket.createdBy as unknown as IUserResponse;
      
      if (commenter && populatedComment) {
        await sendTicketCommentEmail(
          {
            _id: creator._id?.toString() || ticketCreatorId,
            name: creator.name,
            email: creator.email,
            role: creator.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ticket.toObject() as unknown as ITicket,
          populatedComment as unknown as IComment,
          commenter.name
        );
      }
    }

    return NextResponse.json(
      { success: true, data: populatedComment, message: 'Comment added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while adding the comment' },
      { status: 500 }
    );
  }
}
