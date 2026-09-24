import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Repeat,
  Bug,
  BarChart3,
  Github,
  Activity,
  BookOpen,
  Sparkles,
  Users,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Code2
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import CommandPalette from '../components/CommandPalette';

export const AppLayout = () => {
  const { user, logout, fetchMe } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, toggleCommandPalette } = useUiStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Sprints', path: '/sprints', icon: Repeat },
    { label: 'Bugs', path: '/bugs', icon: Bug },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'GitHub', path: '/github', icon: Github },
    { label: 'AI Assistant', path: '/ai', icon: Sparkles }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-zinc-900/90 border-r border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div>
          {/* Logo Branding */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-800/60">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight text-white">DevTrack</span>
                  <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Build. Track. Ship.</span>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="p-3 border-t border-zinc-800/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/40">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-zinc-100 truncate">{user?.name || 'Developer'}</span>
                  <span className="text-[10px] text-zinc-400 truncate">{user?.email || 'dev@track'}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="h-16 px-6 bg-zinc-900/40 border-b border-zinc-800/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCommandPalette}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:border-zinc-700 transition-colors"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Search DevTrack...</span>
              <kbd className="ml-4 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300 font-mono">/</kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className="relative p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/60 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </NavLink>
          </div>
        </header>

        {/* Page View Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
