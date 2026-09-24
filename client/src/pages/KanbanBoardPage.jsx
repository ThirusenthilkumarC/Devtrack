import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Plus, CheckSquare, Layers, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog', color: 'border-zinc-700' },
  { id: 'READY', label: 'Ready', color: 'border-sky-500/50' },
  { id: 'IN_DEVELOPMENT', label: 'In Development', color: 'border-indigo-500/50' },
  { id: 'CODE_REVIEW', label: 'Code Review', color: 'border-purple-500/50' },
  { id: 'TESTING', label: 'Testing', color: 'border-amber-500/50' },
  { id: 'BLOCKED', label: 'Blocked', color: 'border-rose-500/50' },
  { id: 'DONE', label: 'Done', color: 'border-emerald-500/50' }
];

export const KanbanBoardPage = () => {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('BACKLOG');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pRes, tRes] = await Promise.all([
          api.get(`/projects/${projectId}`).catch(() => ({ data: null })),
          api.get(`/tasks?projectId=${projectId}`).catch(() => ({ data: [] }))
        ]);
        setProject(pRes.data);
        setTasks(tRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // column ID

    // Optimistically update frontend state
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));

    // Persist new status to PostgreSQL via REST API
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status on server:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', {
        title,
        description,
        projectId,
        priority,
        status
      });
      if (res.data) {
        setTasks(prev => [...prev, res.data]);
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link to={`/projects/${projectId}`} className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> {project?.name || 'Project'} Kanban Board
            </h1>
            <p className="text-xs text-zinc-400">Drag cards between status columns to update state in real-time</p>
          </div>
        </div>

        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </Button>
      </div>

      {/* Interactive Drag & Drop Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-6 min-h-[500px]">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                id={col.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 flex flex-col min-w-[200px]"
              >
                <div className={`flex items-center justify-between pb-2 mb-3 border-b-2 ${col.color}`}>
                  <span className="text-xs font-bold text-zinc-200 tracking-wide uppercase">{col.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      id={task.id}
                      className="p-3 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-xl shadow-sm space-y-2 cursor-grab active:cursor-grabbing transition-all"
                    >
                      <p className="text-xs font-semibold text-zinc-100 line-clamp-2">{task.title}</p>
                      {task.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <Badge variant={task.priority === 'URGENT' ? 'rose' : task.priority === 'HIGH' ? 'amber' : 'zinc'}>
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] text-zinc-500 font-mono">{task.storyPoints || 1} pts</span>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-24 flex items-center justify-center border border-dashed border-zinc-800/60 rounded-xl text-[11px] text-zinc-600">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Implement authentication middleware"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Description</label>
            <textarea
              rows="3"
              placeholder="Verify JWT token header and decode user payload..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Initial Column</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KanbanBoardPage;
