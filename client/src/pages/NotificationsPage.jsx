import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/notifications');
        setNotifications(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
          <p className="text-xs text-zinc-400 mt-1">Assignments, mentions, and deadline alerts</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
          <CheckCheck className="w-4 h-4 mr-1" /> Mark All as Read
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are all caught up."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                n.isRead ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-indigo-600/10 border-indigo-500/30'
              }`}
            >
              <div>
                <h4 className="font-bold text-white mb-0.5">{n.title}</h4>
                <p className="text-zinc-400">{n.message}</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
