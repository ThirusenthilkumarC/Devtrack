import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, FileText, Search } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES = [
  'Architecture',
  'Requirements',
  'API Documentation',
  'Database Schema',
  'Setup Guide',
  'Deployment Guide',
  'Technical Decisions',
  'Troubleshooting'
];

export const KnowledgeBasePage = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/knowledge');
        setDocs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await api.post('/knowledge', { title, category, content });
      if (res.data) {
        setDocs(prev => [res.data, ...prev]);
        setIsModalOpen(false);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = docs.filter(d => selectedCategory === 'ALL' || d.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Engineering Knowledge Base</h1>
          <p className="text-xs text-zinc-400 mt-1">Central wiki for architecture docs, setup guides, and technical decisions</p>
        </div>
        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Document
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No documents in this section"
          description="Create a new document to start documenting setup, architecture, or requirements."
          actionLabel="Create Document"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> {doc.title}
                </h3>
                <Badge variant="indigo">{doc.category}</Badge>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{doc.content}</p>
              <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
                <span>Author: {doc.author?.name || 'Engineer'}</span>
                <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Document Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Knowledge Document">
        <form onSubmit={handleCreateDoc} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="PostgreSQL Database Schema & Prisma ORM Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Document Content (Markdown format supported)</label>
            <textarea
              rows="6"
              placeholder="Write technical specifications, setup instructions, or API schemas..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KnowledgeBasePage;
