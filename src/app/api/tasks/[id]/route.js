import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { protect } from '@/lib/auth';

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    let task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const body = await request.json();

    // Check permissions
    if (user.role === 'Member') {
      // Member can only update their own task's status
      if (task.assignedTo.toString() !== user.id) {
        return NextResponse.json({ message: 'Not authorized to update this task' }, { status: 403 });
      }
      
      if (body.status) {
        task.status = body.status;
        await task.save();
      }
    } else if (user.role === 'Admin') {
      // Admin can update anything
      task = await Task.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    console.error('Task PUT error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const user = protect(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json({ message: 'Not authorized as Admin' }, { status: 403 });
    }

    await connectDB();
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Task DELETE error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
