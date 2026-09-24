import React, { useEffect, useState } from 'react';
import { Bug, Plus, AlertOctagon, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

export const BugsPage = () => {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [environment, setEnvironment] = useState('Production');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bRes, pRes] = await Promise.all([
          api.get('/bugs'),
          api.get('/projects')
        ]);
        setBugs(bRes.data || []);
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

  const handleCreateBug = async (e) => {
    e.preventDefault();
    if (!title || !projectId) return;

    try {
      const res = await api.post('/bugs', {
        title,
        description,
        projectId,
        severity,
        environment
      });
      if (res.data) {
        setBugs(prev => [res.data, ...prev]);
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bug Tracker</h1>
          <p className="text-xs text-zinc-400 mt-1">Report, classify severity, and resolve software defects</p>
        </div>
        <Button size="sm" variant="danger" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Report Bug
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : bugs.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No reported bugs"
          description="Your software has no registered defects."
          actionLabel="Report Bug"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Bug Title</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Environment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {bugs.map(b => (
                  <tr key={b.id} className="hover:bg-zinc-900/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-100">{b.title}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{b.project?.name || 'Project'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={b.severity === 'CRITICAL' ? 'rose' : b.severity === 'HIGH' ? 'amber' : 'zinc'}>
                        {b.severity}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={b.status === 'RESOLVED' ? 'emerald' : 'rose'}>{b.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{b.environment || 'Production'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Bug Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Bug Defect">
        <form onSubmit={handleCreateBug} className="space-y-4">
          <Input
            label="Bug Title"
            placeholder="CORS origin header missing on login POST request"
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
              placeholder="Steps to reproduce error..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <Input
              label="Environment"
              placeholder="Production / Staging"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Submit Defect</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BugsPage;
