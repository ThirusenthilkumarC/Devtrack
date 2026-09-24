import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Shield } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/team');
        setMembers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const res = await api.post('/team/invite', { name, email, role });
      if (res.data) {
        setMembers(prev => [...prev, res.data]);
        setIsModalOpen(false);
        setName('');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & RBAC</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage team members, access roles, and permissions</p>
        </div>
        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-1" /> Invite Member
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members"
          description="Invite developers to collaborate on your projects."
          actionLabel="Invite Member"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-zinc-900/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px]">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{m.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={m.role === 'ADMIN' || m.role === 'OWNER' ? 'indigo' : 'zinc'}>
                        <Shield className="w-3 h-3 mr-1 inline" /> {m.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-mono">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            placeholder="sarah@devtrack.io"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
            >
              <option value="MEMBER">Member (Standard Access)</option>
              <option value="ADMIN">Admin (Project & Member Management)</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamPage;
