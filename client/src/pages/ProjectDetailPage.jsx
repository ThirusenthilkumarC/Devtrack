import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Repeat,
  Bug,
  Github,
  BarChart3,
  Users,
  Activity,
  Settings,
  ExternalLink,
  Plus,
  Calendar,
  Layers
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) return <Skeleton className="h-96" />;
  if (!project) return <EmptyState title="Project Not Found" description="The requested project does not exist." />;

  const tabs = [
    { label: 'Overview', icon: FolderKanban },
    { label: 'Tasks', icon: CheckSquare },
    { label: 'Sprints', icon: Repeat },
    { label: 'Bugs', icon: Bug },
    { label: 'Team', icon: Users },
    { label: 'GitHub', icon: Github },
    { label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <Badge variant="indigo">{project.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{project.description || 'No description provided.'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/projects/${id}/board`}>
            <Button size="sm" variant="primary">
              <Layers className="w-4 h-4 mr-1" /> Open Kanban Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800/80 gap-2 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.label
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Specification</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Category</span>
                  <span className="font-semibold text-zinc-200">{project.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Tech Stack</span>
                  <span className="font-semibold text-zinc-200">{project.techStack || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Start Date</span>
                  <span className="font-semibold text-zinc-200">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Target Deadline</span>
                  <span className="font-semibold text-zinc-200">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Metrics</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-zinc-900">
                  <span className="text-zinc-400">Total Tasks</span>
                  <span className="font-bold text-white">{project.tasks?.length || 0}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-zinc-900">
                  <span className="text-zinc-400">Open Bugs</span>
                  <span className="font-bold text-rose-400">{project.bugs?.length || 0}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-zinc-900">
                  <span className="text-zinc-400">Active Sprints</span>
                  <span className="font-bold text-indigo-400">{project.sprints?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="space-y-3">
            {project.tasks?.length === 0 ? (
              <EmptyState title="No tasks for this project yet" description="Add tasks to populate the Kanban board." />
            ) : (
              project.tasks?.map(t => (
                <div key={t.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-zinc-400">{t.description}</p>
                  </div>
                  <Badge variant="indigo">{t.status.replace('_', ' ')}</Badge>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'GitHub' && (
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center py-12">
            <Github className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">
              {project.githubRepoUrl ? 'GitHub Connected' : 'GitHub Not Connected'}
            </h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              {project.githubRepoUrl ? project.githubRepoUrl : 'Connect your repository to sync commits, issues, and pull requests.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
