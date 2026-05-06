import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { protect } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find().populate('createdBy', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: projects.length, data: projects }, { status: 200 });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json({ message: 'Not authorized as Admin' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json({ message: 'Please provide name and description' }, { status: 400 });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
