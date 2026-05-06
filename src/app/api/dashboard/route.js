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
    
    let query = {};
    if (user.role === 'Member') {
      query.assignedTo = user.id;
    }

    const tasks = await Task.find(query);

    const now = new Date();
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length,
    };

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
