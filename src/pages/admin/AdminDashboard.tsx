import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, FolderOpen, Tags, TrendingUp, Plus, Clock, Edit } from 'lucide-react';
import { getAllArticles, getCategories, getTags } from '@/lib/api';
import { formatRelativeTime, formatViewCount } from '@/lib/utils';
import type { Article, Category, Tag } from '@/lib/types';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [arts, cats, tgs] = await Promise.all([
          getAllArticles(),
          getCategories(),
          getTags(),
        ]);
        setArticles(arts);
        setCategories(cats);
        setTags(tgs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const published = articles.filter(a => a.status === 'published');
  const drafts = articles.filter(a => a.status === 'draft');
  const scheduled = articles.filter(a => a.status === 'scheduled');
  const totalViews = articles.reduce((sum, a) => sum + a.view_count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
          { label: 'Total Views', value: formatViewCount(totalViews), icon: Eye, color: 'bg-green-500' },
          { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'bg-purple-500' },
          { label: 'Tags', value: tags.length, icon: Tags, color: 'bg-orange-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#0A1628]">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/articles/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition">
          <Plus size={16} /> New Article
        </Link>
        <Link to="/admin/categories" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition">
          <FolderOpen size={16} /> Manage Categories
        </Link>
        <Link to="/admin/tags" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition">
          <Tags size={16} /> Manage Tags
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#0A1628]">Recent Articles</h3>
            <Link to="/admin/articles" className="text-xs text-[#00897B] font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {articles.slice(0, 8).map(article => (
              <div key={article.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {article.featured_image && <img src={article.featured_image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A1628] truncate">{article.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      article.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {article.status}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatRelativeTime(article.created_at)}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Eye size={10} /> {formatViewCount(article.view_count)}</span>
                  </div>
                </div>
                <Link to={`/admin/articles/edit/${article.id}`} className="p-2 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition">
                  <Edit size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-[#0A1628] mb-4">Article Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Published', count: published.length, color: 'bg-green-500' },
                { label: 'Drafts', count: drafts.length, color: 'bg-yellow-500' },
                { label: 'Scheduled', count: scheduled.length, color: 'bg-blue-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0A1628]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Articles */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-[#0A1628] mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-orange-500" /> Top Performing
            </h3>
            <div className="space-y-3">
              {[...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5).map((article, i) => (
                <div key={article.id} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0A1628] truncate">{article.title}</p>
                    <p className="text-[10px] text-gray-400">{formatViewCount(article.view_count)} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
