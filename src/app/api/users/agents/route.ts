import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { User } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse, IUserResponse } from '@/types';

// GET /api/users/agents - Get all agents
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

    // Only agents can list other agents
    if (payload.role !== 'agent') {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await dbConnect();

    const agents = await User.find({ role: 'agent' }).select('-password');

    const agentResponses: IUserResponse[] = agents.map((agent) => ({
      _id: agent._id.toString(),
      name: agent.name,
      email: agent.email,
      role: agent.role,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }));

    return NextResponse.json<IApiResponse<IUserResponse[]>>(
      { success: true, data: agentResponses },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while fetching agents' },
      { status: 500 }
    );
  }
}
