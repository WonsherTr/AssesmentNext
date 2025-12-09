import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { Ticket, User } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse, ITicket } from '@/types';
import { sendTicketClosedEmail } from '@/utils/email';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/tickets/[id] - Get a single ticket
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .lean();

    if (!ticket) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Clients can only view their own tickets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdById = (ticket.createdBy as any)?._id?.toString() || ticket.createdBy?.toString();
    if (payload.role === 'client' && createdById !== payload.userId) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: ticket },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while fetching the ticket' },
      { status: 500 }
    );
  }
}

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const ticket = await Ticket.findById(id).populate('createdBy', 'name email role');

    if (!ticket) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();

    // Permission checks based on role
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ticketCreatorId = (ticket.createdBy as any)?._id?.toString() || ticket.createdBy?.toString();
    if (payload.role === 'client') {
      // Clients can only update their own tickets and only title/description
      if (ticketCreatorId !== payload.userId) {
        return NextResponse.json<IApiResponse<null>>(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
      // Clients cannot change status, priority, or assignedTo
      delete updateData.status;
      delete updateData.priority;
      delete updateData.assignedTo;
    }

    // Check if status is being changed to closed
    const isClosing = updateData.status === 'closed' && ticket.status !== 'closed';

    // Only agents can change status to resolved or closed
    if (payload.role === 'client' && (updateData.status === 'resolved' || updateData.status === 'closed')) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Only agents can resolve or close tickets' },
        { status: 403 }
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .lean();

    // Send email notification if ticket is closed
    if (isClosing && updatedTicket) {
      const creator = await User.findById(ticketCreatorId);
      if (creator) {
        await sendTicketClosedEmail(
          {
            _id: creator._id.toString(),
            name: creator.name,
            email: creator.email,
            role: creator.role,
            createdAt: creator.createdAt,
            updatedAt: creator.updatedAt,
          },
          updatedTicket as unknown as ITicket
        );
      }
    }

    return NextResponse.json(
      { success: true, data: updatedTicket, message: 'Ticket updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while updating the ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id] - Delete a ticket
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Only agents can delete tickets
    if (payload.role !== 'agent') {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Only agents can delete tickets' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<IApiResponse<null>>(
      { success: true, message: 'Ticket deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while deleting the ticket' },
      { status: 500 }
    );
  }
}
