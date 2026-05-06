import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find().select('-password');

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
