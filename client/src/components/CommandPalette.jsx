import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, CheckSquare, Bug, BookOpen, X } from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import api from '../services/api';

export const CommandPalette = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], bugs: [], docs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (!query.trim() || !isCommandPaletteOpen) {
      setResults({ projects: [], tasks: [], bugs: [], docs: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [pRes, tRes, bRes, kRes] = await Promise.all([
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/tasks').catch(() => ({ data: [] })),
          api.get('/bugs').catch(() => ({ data: [] })),
          api.get('/knowledge').catch(() => ({ data: [] }))
        ]);

        const q = query.toLowerCase();
        setResults({
          projects: (pRes.data || []).filter(p => p.name.toLowerCase().includes(q)),
          tasks: (tRes.data || []).filter(t => t.title.toLowerCase().includes(q)),
          bugs: (bRes.data || []).filter(b => b.title.toLowerCase().includes(q)),
          docs: (kRes.data || []).filter(d => d.title.toLowerCase().includes(q))
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const handleSelect = (url) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search projects, tasks, bugs, docs..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {isLoading && (
            <div className="py-6 text-center text-xs text-zinc-500 animate-pulse">Searching DevTrack...</div>
          )}

          {!isLoading && !query.trim() && (
            <div className="py-6 text-center text-xs text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">Esc</kbd> to exit or start typing to search across DevTrack.
            </div>
          )}

          {!isLoading && query.trim() && (
            <>
              {results.projects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">Projects</div>
                  {results.projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`/projects/${p.id}`)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-200 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <Folder className="w-4 h-4" />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.tasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">Tasks</div>
                  {results.tasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleSelect(`/tasks`)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-200 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>{t.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.bugs.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">Bugs</div>
                  {results.bugs.map(b => (
                    <div
                      key={b.id}
                      onClick={() => handleSelect(`/bugs`)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-200 hover:bg-rose-600/10 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <Bug className="w-4 h-4" />
                      <span>{b.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.docs.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">Knowledge Docs</div>
                  {results.docs.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelect(`/knowledge`)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-200 hover:bg-purple-600/10 hover:text-purple-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{d.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.projects.length === 0 && results.tasks.length === 0 && results.bugs.length === 0 && results.docs.length === 0 && (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No matches found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
