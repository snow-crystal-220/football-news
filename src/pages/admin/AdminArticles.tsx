import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, ExternalLink, Filter } from 'lucide-react';
import { getAllArticles, deleteArticle, updateArticle } from '@/lib/api';
import { formatRelativeTime, formatViewCount } from '@/lib/utils';
import type { Article } from '@/lib/types';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await updateArticle(article.id, {
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : article.published_at,
      });
      setArticles(articles.map(a => a.id === article.id ? updated : a));
    } catch (err) {
      console.error('Failed to update article:', err);
    }
  };

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#0A1628]">Articles</h1>
          <p className="text-sm text-gray-500">{articles.length} total articles</p>
        </div>
        <Link to="/admin/articles/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Article</th>
                <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Author</th>
                <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Views</th>
                <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        {article.featured_image && <img src={article.featured_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0A1628] truncate max-w-xs">{article.title}</p>
                        <p className="text-[10px] text-gray-400">{formatRelativeTime(article.created_at)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-600">{article.category?.name || '-'}</span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-600">{article.author?.display_name || '-'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded cursor-pointer ${
                        article.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                        article.status === 'scheduled' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                        'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      } transition`}
                    >
                      {article.status}
                    </button>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={10} /> {formatViewCount(article.view_count)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/article/${article.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        <ExternalLink size={14} />
                      </Link>
                      <Link to={`/admin/articles/edit/${article.id}`} className="p-1.5 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition">
                        <Edit size={14} />
                      </Link>
                      {deleteConfirm === article.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(article.id)} className="px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[10px] font-bold bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(article.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
