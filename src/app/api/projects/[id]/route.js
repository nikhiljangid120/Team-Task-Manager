import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { protect } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const project = await Project.findById(params.id).populate('createdBy', 'name email');

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json({ message: 'Not authorized as Admin' }, { status: 403 });
    }

    await connectDB();
    const project = await Project.findByIdAndDelete(params.id);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
