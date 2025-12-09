import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { User } from '@/models';
import { comparePassword, generateToken } from '@/utils/auth';
import { IApiResponse, ILoginResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateToken(userResponse);

    const response: ILoginResponse = {
      user: userResponse,
      token,
    };

    return NextResponse.json<IApiResponse<ILoginResponse>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
