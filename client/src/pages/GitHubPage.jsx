import React, { useEffect, useState } from 'react';
import { Github, Star, GitFork, AlertCircle, Link2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import Input from '../components/ui/Input';

export const GitHubPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [githubUrl, setGithubUrl] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/projects');
        setProjects(res.data || []);
        if (res.data?.length > 0) {
          setSelectedProjectId(res.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchGitHubStatus = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/github?projectId=${selectedProjectId}`);
        setStatus(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGitHubStatus();
  }, [selectedProjectId]);

  const handleLinkRepo = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !githubUrl) return;

    try {
      setIsLinking(true);
      await api.post('/github/connect', { projectId: selectedProjectId, githubRepoUrl: githubUrl });
      const res = await api.get(`/github?projectId=${selectedProjectId}`);
      setStatus(res);
      setGithubUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GitHub Repository Integration</h1>
          <p className="text-xs text-zinc-400 mt-1">Connect GitHub repositories to track live commit activity, issues, and PRs</p>
        </div>
      </div>

      {/* Project Selector */}
      {projects.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
          <label className="text-xs font-semibold text-zinc-300">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !status?.connected ? (
        <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 mx-auto">
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">GitHub is not connected.</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            {status?.message || 'Link a real GitHub repository URL to enable live integration metrics for this project.'}
          </p>

          <form onSubmit={handleLinkRepo} className="max-w-md mx-auto flex items-center gap-2 pt-2">
            <Input
              placeholder="https://github.com/facebook/react"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
            />
            <Button type="submit" size="md" variant="primary" isLoading={isLinking}>
              Link Repository
            </Button>
          </form>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-200">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {status.data?.fullName || 'GitHub Repository Connected'}
                  <a href={status.data?.htmlUrl || '#'} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h3>
                <p className="text-xs text-zinc-400">{status.data?.description || 'Repository linked successfully.'}</p>
              </div>
            </div>
            <Badge variant="emerald">Connected</Badge>
          </div>

          {status.data && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800 text-center">
              <div className="p-4 rounded-xl bg-zinc-900">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  <Star className="w-4 h-4" /> <span className="text-xs font-bold">Stars</span>
                </div>
                <span className="text-lg font-black text-white">{status.data.stars}</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900">
                <div className="flex items-center justify-center gap-1 text-sky-400 mb-1">
                  <GitFork className="w-4 h-4" /> <span className="text-xs font-bold">Forks</span>
                </div>
                <span className="text-lg font-black text-white">{status.data.forks}</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900">
                <div className="flex items-center justify-center gap-1 text-rose-400 mb-1">
                  <AlertCircle className="w-4 h-4" /> <span className="text-xs font-bold">Open Issues</span>
                </div>
                <span className="text-lg font-black text-white">{status.data.openIssues}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubPage;
