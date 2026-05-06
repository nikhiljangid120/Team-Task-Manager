import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { protect } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    
    // Admin sees all, member sees only their tasks
    let query = {};
    if (user.role === 'Member') {
      query.assignedTo = user.id;
    }

    // Optional project filter
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    if (projectId) {
      query.project = projectId;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    return NextResponse.json({ success: true, count: tasks.length, data: tasks }, { status: 200 });
  } catch (error) {
    console.error('Tasks GET error:', error);
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
    const { title, description, project, assignedTo, dueDate } = body;

    if (!title || !description || !project || !assignedTo || !dueDate) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error('Tasks POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
