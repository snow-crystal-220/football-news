import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, LayoutGrid, List } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { getArticles, getCategoryBySlug } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import type { Article, Category } from '@/lib/types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const [cat, arts] = await Promise.all([
          getCategoryBySlug(slug),
          getArticles({ categorySlug: slug, limit: 20 }),
        ]);
        setCategory(cat);
        setArticles(arts);
      } catch (err) {
        console.error('Failed to load category:', err);
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'popular') return b.view_count - a.view_count;
    return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const catColor = category?.color || CATEGORIES.find(c => c.slug === slug)?.color || '#00FF87';
  const catName = category?.name || CATEGORIES.find(c => c.slug === slug)?.name || 'Category';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">{catName}</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-10 rounded-full" style={{ backgroundColor: catColor }} />
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{catName}</h1>
              {category?.description && (
                <p className="text-gray-400 text-sm mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{articles.length} articles</p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#0A1628] text-white' : 'text-gray-400 hover:text-gray-600'} transition`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-[#0A1628] text-white' : 'text-gray-400 hover:text-gray-600'} transition`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {sortedArticles.map((article, i) => (
                  <React.Fragment key={article.id}>
                    <ArticleCard article={article} variant="featured" />
                    {i === 3 && <div className="sm:col-span-2"><AdSlot slotId="in-article" /></div>}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedArticles.map((article, i) => (
                  <React.Fragment key={article.id}>
                    <ArticleCard article={article} variant="horizontal" />
                    {i === 3 && <AdSlot slotId="in-article" />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {articles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No articles found in this category.</p>
                <Link to="/" className="inline-block mt-4 px-6 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-semibold hover:bg-[#0A1628]/90 transition">
                  Back to Home
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot slotId="sidebar-top" />

            {/* Other Categories */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-base font-bold text-[#0A1628] mb-4">More Leagues</h3>
              <div className="space-y-2">
                {CATEGORIES.filter(c => c.slug !== slug).map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <AdSlot slotId="sidebar-bottom" />
          </aside>
        </div>
      </div>
    </div>
  );
}
