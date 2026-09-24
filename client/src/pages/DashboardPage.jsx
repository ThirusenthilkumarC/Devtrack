import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Bug,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [analyticsRes, projectsRes, tasksRes, activityRes] = await Promise.all([
          api.get('/analytics').catch(() => ({ data: {} })),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/tasks').catch(() => ({ data: [] })),
          api.get('/activity').catch(() => ({ data: [] }))
        ]);

        setData(analyticsRes.data?.summary || null);
        setProjects(projectsRes.data || []);
        setTasks(tasksRes.data || []);
        setActivities(activityRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Engineering Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">Real-time metrics from your active database</p>
        </div>
        <Link to="/projects/new">
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </Link>
      </div>

      {!hasProjects ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects in database yet"
          description="Create your first software project to start tracking tasks, sprints, bugs, and development metrics."
          actionLabel="Create First Project"
          onAction={() => window.location.href = '/projects/new'}
        />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Projects</p>
                <p className="text-2xl font-black text-white mt-1">{data?.totalProjects || 0}</p>
                <span className="text-[10px] text-indigo-400 mt-1 inline-block">{data?.activeProjects || 0} active</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Tasks</p>
                <p className="text-2xl font-black text-white mt-1">{data?.totalTasks || 0}</p>
                <span className="text-[10px] text-emerald-400 mt-1 inline-block">{data?.completedTasks || 0} completed</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Overdue Tasks</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{data?.overdueTasks || 0}</p>
                <span className="text-[10px] text-amber-400/80 mt-1 inline-block">Requires attention</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Open Bugs</p>
                <p className="text-2xl font-black text-rose-400 mt-1">{data?.openBugs || 0}</p>
                <span className="text-[10px] text-rose-400/80 mt-1 inline-block">{data?.criticalBugs || 0} critical</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Bug className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-400" /> Active Projects
                </h3>
                <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {projects.slice(0, 4).map(project => {
                  const pTasks = tasks.filter(t => t.projectId === project.id);
                  const pDone = pTasks.filter(t => t.status === 'DONE').length;
                  const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

                  return (
                    <div key={project.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between">
                      <div className="space-y-1">
                        <Link to={`/projects/${project.id}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                          {project.name}
                        </Link>
                        <p className="text-xs text-zinc-400 line-clamp-1">{project.description || 'No description'}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="indigo">{project.category || 'Engineering'}</Badge>
                          <span className="text-[10px] text-zinc-500">{pTasks.length} tasks</span>
                        </div>
                      </div>

                      <div className="text-right w-28 shrink-0">
                        <div className="text-xs font-semibold text-zinc-300 mb-1">{pct}% done</div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" /> Recent Audit Activity
                </h3>
              </div>

              {activities.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">No recent actions recorded.</p>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 5).map(act => (
                    <div key={act.id} className="text-xs flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-semibold text-zinc-200">{act.user?.name || 'User'}</span>{' '}
                        <span className="text-zinc-400">{act.action}</span>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
