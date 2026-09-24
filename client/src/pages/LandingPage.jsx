import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  FolderKanban,
  CheckSquare,
  Repeat,
  Bug,
  BarChart3,
  Github,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  GitBranch,
  Terminal,
  Cpu
} from 'lucide-react';
import Button from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="h-20 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">DevTrack</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register">
            <Button size="sm" variant="primary">
              Start Building <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden max-w-5xl mx-auto">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-violet-500/10 blur-[130px] pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-8">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Developer SDLC Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          BUILD. TRACK. SHIP.
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          One unified workspace for your complete software development lifecycle — from planning epics to tracking bugs and monitoring GitHub activity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" variant="primary" className="w-full sm:w-auto px-8">
              Start Building Free <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
              Explore Features
            </Button>
          </a>
        </div>
      </section>

      {/* 2. Why DevTrack */}
      <section className="py-20 px-6 bg-zinc-900/40 border-y border-zinc-800/60">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">Why DevTrack</h2>
          <h3 className="text-3xl font-extrabold text-white mb-12">Engineered specifically for engineering teams</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80">
              <Zap className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Zero Mock Data Overhead</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">All statistics, velocity charts, and activity feeds reflect real database models and live API integrations.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80">
              <GitBranch className="w-8 h-8 text-violet-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">GitHub Native Workflow</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Connect repositories directly to tasks and pull requests for end-to-end tracebility.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80">
              <Cpu className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Architectural AI Intelligence</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">AI project planning, task decomposition, and standup generation tuned for software engineers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">Core Features</h2>
          <h3 className="text-3xl font-extrabold text-white">Everything needed to manage development</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FolderKanban, title: 'Project Management', desc: 'Planning, tech stacks, milestones, and status tracking.' },
            { icon: CheckSquare, title: 'Interactive Kanban', desc: 'Drag-and-drop tasks with persistent PostgreSQL sync.' },
            { icon: Repeat, title: 'Agile Sprints', desc: 'Sprint goals, story points, velocity, and burndown charts.' },
            { icon: Bug, title: 'Bug Tracker', desc: 'Severity classification linked directly to tasks & GitHub issues.' },
            { icon: BarChart3, title: 'Real Analytics', desc: 'Recharts visualizations of real completion metrics.' },
            { icon: Github, title: 'GitHub Integration', desc: 'Live repository metrics, commits, issues, and PR links.' },
            { icon: Sparkles, title: 'AI Assistant', desc: 'Task breakdown & project health analysis.' },
            { icon: ShieldCheck, title: 'Enterprise RBAC', desc: 'Role-based authorization for Owners, Admins, and Members.' }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 transition-colors">
                <Icon className="w-6 h-6 text-indigo-400 mb-4" />
                <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-900/60 to-zinc-950 border-t border-zinc-800/60 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to elevate your development workflow?</h2>
          <p className="text-sm text-zinc-400 mb-8">Join engineering teams building software with clarity and precision.</p>
          <Link to="/register">
            <Button size="lg" variant="primary" className="px-8">
              Get Started with DevTrack <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-900 text-center text-xs text-zinc-500">
        <p>© 2026 DevTrack. Build. Track. Ship.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
