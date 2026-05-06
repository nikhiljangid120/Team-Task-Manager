"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, CheckSquare } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    project: '',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data.data);
      if (data.data.length > 0) setFormData(f => ({ ...f, project: data.data[0]._id }));
    }
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data);
      if (data.data.length > 0) setFormData(f => ({ ...f, assignedTo: data.data[0]._id }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: '', description: '', project: projects[0]?._id, assignedTo: users[0]?._id, dueDate: '' });
        setShowForm(false);
        fetchTasks();
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="badge badge-pending">Pending</span>;
      case 'In Progress': return <span className="badge badge-in-progress">In Progress</span>;
      case 'Completed': return <span className="badge badge-completed">Completed</span>;
      default: return null;
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading tasks...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Tasks</h1>
          <p style={{ color: '#94a3b8' }}>{user?.role === 'Admin' ? 'Manage all team tasks.' : 'Here are your assigned tasks.'}</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Assign New Task</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-input" 
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Project</label>
                <select 
                  className="form-input" 
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Assign To</label>
                <select 
                  className="form-input" 
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Member</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CheckSquare size={48} style={{ color: '#475569', margin: '0 auto 1rem' }} />
          <h3>No tasks found</h3>
          <p style={{ color: '#94a3b8' }}>{user?.role === 'Admin' ? 'Get started by creating a new task.' : "You don't have any tasks assigned yet."}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => (
            <div key={task._id} className="glass-card" style={{ padding: '1rem 1.5rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--foreground)' }}>{task.title}</h3>
                {getStatusBadge(task.status)}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '1rem' }}>{task.description}</p>
              
              <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                  <span><strong>Project:</strong> {task.project?.name}</span>
                  {user?.role === 'Admin' && <span><strong>Assigned To:</strong> {task.assignedTo?.name}</span>}
                  <span><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                
                {(user?.role === 'Member' || user?.role === 'Admin') && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select 
                      className="form-input" 
                      style={{ padding: '0.25rem 0.5rem', minWidth: '130px' }}
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
