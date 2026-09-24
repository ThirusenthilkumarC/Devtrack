import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Activity, ListChecks, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

export const AiAssistantPage = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [healthData, setHealthData] = useState(null);
  const [standupData, setStandupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Planner form
  const [prompt, setPrompt] = useState('');
  const [planResult, setPlanResult] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  useEffect(() => {
    const fetchAiStatus = async () => {
      try {
        setIsLoading(true);
        const [hRes, sRes] = await Promise.all([
          api.get('/ai/health').catch(() => ({ data: null })),
          api.get('/ai/standup').catch(() => ({ data: null }))
        ]);
        setHealthData(hRes);
        setStandupData(sRes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAiStatus();
  }, []);

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsPlanning(true);
      const res = await api.post('/ai/plan', { prompt });
      setPlanResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" /> AI Developer Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">AI-driven SDLC planner, standup generator, and project health analyzer</p>
        </div>
        {healthData && (
          <Badge variant={healthData.configured ? 'emerald' : 'amber'}>
            {healthData.configured ? 'AI Key Active' : 'Configuration Mode'}
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-2">
        {[
          { id: 'health', label: 'Project Health', icon: Activity },
          { id: 'planner', label: 'AI Project Planner', icon: Cpu },
          { id: 'standup', label: 'Standup Assistant', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <>
          {activeTab === 'health' && healthData && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Project Health Diagnostic</h3>
                <Badge variant={healthData.health?.status === 'EXCELLENT' ? 'emerald' : healthData.health?.status === 'AT_RISK' ? 'rose' : 'indigo'}>
                  {healthData.health?.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-2">
                <div className="p-3 bg-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">Total Tasks</span>
                  <span className="text-lg font-bold text-white">{healthData.health?.metrics?.totalTasks}</span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">Completed</span>
                  <span className="text-lg font-bold text-emerald-400">{healthData.health?.metrics?.completedTasks}</span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">Overdue</span>
                  <span className="text-lg font-bold text-amber-400">{healthData.health?.metrics?.overdueTasks}</span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">Open Bugs</span>
                  <span className="text-lg font-bold text-rose-400">{healthData.health?.metrics?.openBugs}</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Automated Insights</h4>
                {healthData.health?.insights?.map((ins, i) => (
                  <p key={i} className="text-xs text-zinc-400 py-1 border-b border-zinc-800/40">• {ins}</p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">AI Project Architect</h3>
                <p className="text-xs text-zinc-400">Describe your software vision to generate milestones and technical task breakdowns.</p>
              </div>

              <form onSubmit={handlePlanSubmit} className="flex gap-2">
                <Input
                  placeholder="e.g. Build a microservice food delivery platform with real-time tracking"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" isLoading={isPlanning} className="shrink-0">
                  Generate Plan
                </Button>
              </form>

              {planResult && (
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  {!planResult.configured && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{planResult.message}</span>
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-indigo-400">{planResult.fallbackPlan?.suggestedProjectName || 'Generated Plan'}</h4>
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-zinc-300">Milestones:</p>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      {planResult.fallbackPlan?.milestones?.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'standup' && standupData && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white">Daily Standup Assistant</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-emerald-400 mb-1">Completed / Yesterday</h4>
                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                    {standupData.standup?.yesterday?.map((y, i) => <li key={i}>{y}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-indigo-400 mb-1">In Progress / Today</h4>
                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                    {standupData.standup?.today?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-rose-400 mb-1">Blockers</h4>
                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                    {standupData.standup?.blockers?.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AiAssistantPage;
