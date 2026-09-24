import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('BACKLOG');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tRes, pRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects')
        ]);
        setTasks(tRes.data || []);
        setProjects(pRes.data || []);
        if (pRes.data?.length > 0) setProjectId(pRes.data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title || !projectId) return;

    try {
      const res = await api.post('/tasks', {
        title,
        description,
        projectId,
        priority,
        status
      });
      if (res.data) {
        setTasks(prev => [res.data, ...prev]);
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Task Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">Global list of all backlog, sprint, and development items</p>
        </div>
        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none w-full sm:w-48"
        >
          <option value="ALL">All Statuses</option>
          <option value="BACKLOG">Backlog</option>
          <option value="READY">Ready</option>
          <option value="IN_DEVELOPMENT">In Development</option>
          <option value="CODE_REVIEW">Code Review</option>
          <option value="TESTING">Testing</option>
          <option value="BLOCKED">Blocked</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match criteria"
          description="Create your first task or change your search filter."
          actionLabel="Create Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Task Title</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-zinc-900/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-100">{task.title}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{task.project?.name || 'DevTrack'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={task.status === 'DONE' ? 'emerald' : task.status === 'BLOCKED' ? 'rose' : 'indigo'}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={task.priority === 'URGENT' ? 'rose' : task.priority === 'HIGH' ? 'amber' : 'zinc'}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{task.assignee?.name || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Build JWT authentication middleware"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
              required
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Description</label>
            <textarea
              rows="3"
              placeholder="Detail task requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
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
              <label className="text-xs font-semibold text-zinc-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="READY">Ready</option>
                <option value="IN_DEVELOPMENT">In Development</option>
                <option value="DONE">Done</option>
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

export default TasksPage;
