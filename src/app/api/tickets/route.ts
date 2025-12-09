import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { Ticket, User } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse, ITicket } from '@/types';
import { sendTicketCreatedEmail } from '@/utils/email';

// GET /api/tickets - List tickets with filters
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
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const createdBy = searchParams.get('createdBy');
    const assignedTo = searchParams.get('assignedTo');

    // Build query based on user role
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Clients can only see their own tickets
    if (payload.role === 'client') {
      query.createdBy = payload.userId;
    } else {
      // Agents can filter by createdBy
      if (createdBy) query.createdBy = createdBy;
      if (assignedTo) query.assignedTo = assignedTo;
    }

    // Apply common filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: tickets },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while fetching tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket
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

    const { title, description, priority = 'medium' } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (title.length < 5) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: payload.userId,
      status: 'open',
    });

    // Populate references for response
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .lean();

    // Send email notification
    const user = await User.findById(payload.userId);
    if (user && populatedTicket) {
      await sendTicketCreatedEmail(
        {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        populatedTicket as unknown as ITicket
      );
    }

    return NextResponse.json(
      { success: true, data: populatedTicket, message: 'Ticket created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while creating the ticket' },
      { status: 500 }
    );
  }
}
