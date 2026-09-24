import React, { useEffect, useState } from 'react';
import { Repeat, Plus, Calendar, Target, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

export const SprintsPage = () => {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [sRes, pRes] = await Promise.all([
          api.get('/sprints'),
          api.get('/projects')
        ]);
        setSprints(sRes.data || []);
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

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!name || !projectId) return;

    try {
      const res = await api.post('/sprints', { name, goal, projectId });
      if (res.data) {
        setSprints(prev => [...prev, res.data]);
        setIsModalOpen(false);
        setName('');
        setGoal('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agile Sprint Management</h1>
          <p className="text-xs text-zinc-400 mt-1">Plan sprint goals, story points, and monitor sprint velocity</p>
        </div>
        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Sprint
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : sprints.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No active sprints"
          description="Create a sprint to organize tasks into 2-week agile iterations."
          actionLabel="Create Sprint"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sprints.map(s => (
            <div key={s.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{s.name}</h3>
                <Badge variant={s.status === 'ACTIVE' ? 'emerald' : 'indigo'}>{s.status}</Badge>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Goal: {s.goal || 'No goal specified.'}</span>
              </p>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</span>
                </div>
                <span className="font-mono text-indigo-400">{s.tasks?.length || 0} tasks assigned</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Sprint Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Sprint">
        <form onSubmit={handleCreateSprint} className="space-y-4">
          <Input
            label="Sprint Name"
            placeholder="Sprint 1 - Authentication & Core API"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <label className="text-xs font-semibold text-zinc-300">Sprint Goal</label>
            <textarea
              rows="2"
              placeholder="Complete JWT token authentication & protected route middleware..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Sprint</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SprintsPage;
