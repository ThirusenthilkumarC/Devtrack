import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Code2 className="w-6 h-6" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white">DevTrack</span>
      </Link>

      {/* Auth Form Card */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
