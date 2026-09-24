import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import api from '../services/api';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/activity');
        setActivities(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Audit Timeline</h1>
        <p className="text-xs text-zinc-400 mt-1">Immutable audit log of user actions, project events, and task updates</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No system activity recorded"
          description="Actions performed across DevTrack will automatically appear here."
        />
      ) : (
        <div className="space-y-3">
          {activities.map(act => (
            <div key={act.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span className="font-bold text-white">{act.user?.name || 'User'}</span>{' '}
                  <span className="text-zinc-300">{act.action}</span>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{act.entityType}</div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date(act.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
