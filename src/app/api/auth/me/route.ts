import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { User } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse, IUserResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'No token provided' },
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

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userResponse: IUserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json<IApiResponse<IUserResponse>>(
      { success: true, data: userResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
