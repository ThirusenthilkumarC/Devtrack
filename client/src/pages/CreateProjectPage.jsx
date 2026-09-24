import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export const CreateProjectPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [techStack, setTechStack] = useState('React, Node.js, Express, PostgreSQL');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post('/projects', {
        name,
        description,
        category,
        techStack,
        startDate: startDate || undefined,
        deadline: deadline || undefined,
        githubRepoUrl,
        liveDemoUrl
      });
      if (res.data?.id) {
        navigate(`/projects/${res.data.id}`);
      } else {
        navigate('/projects');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Software Project</h1>
        <p className="text-xs text-zinc-400 mt-1">Define repository parameters and project timeline</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <Input
          label="Project Name"
          placeholder="DevTrack Platform"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">Description</label>
          <textarea
            rows="3"
            placeholder="High-performance developer platform for SDLC management..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Category"
            placeholder="Web Application"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            label="Tech Stack"
            placeholder="React, Express, PostgreSQL"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Target Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <Input
          label="GitHub Repository URL (Optional)"
          placeholder="https://github.com/organization/repo"
          value={githubRepoUrl}
          onChange={(e) => setGithubRepoUrl(e.target.value)}
        />

        <Input
          label="Live Demo URL (Optional)"
          placeholder="https://devtrack.app"
          value={liveDemoUrl}
          onChange={(e) => setLiveDemoUrl(e.target.value)}
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
