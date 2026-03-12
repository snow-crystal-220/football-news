import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight, Flame, Newspaper, ArrowRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { getArticles, getCategories } from '@/lib/api';
import { IMAGES, CATEGORIES } from '@/lib/constants';
import type { Article, Category } from '@/lib/types';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [arts, cats] = await Promise.all([
          getArticles({ limit: 18 }),
          getCategories(),
        ]);
        setArticles(arts);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading latest news...</span>
        </div>
      </div>
    );
  }

  const featured = articles.filter(a => a.is_featured);
  const trending = articles.filter(a => a.is_trending);
  const latest = articles.slice(0, 12);
  const heroArticle = featured[0] || articles[0];
  const featuredRest = featured.length > 1 ? featured.slice(1, 4) : articles.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Ad */}
      <div className="max-w-7xl mx-auto px-4 py-3 hidden md:block">
        <AdSlot slotId="header-banner" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Hero */}
          <div className="lg:col-span-2">
            {heroArticle && <ArticleCard article={heroArticle} variant="hero" />}
          </div>
          {/* Side Featured */}
          <div className="flex flex-col gap-4">
            {featuredRest.map(article => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
            {/* Breaking News Box */}
            <div className="bg-[#0A1628] rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={16} className="text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Breaking News</h3>
              </div>
              <div className="space-y-3">
                {articles.filter(a => a.is_breaking).slice(0, 3).map(article => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="block group">
                    <p className="text-xs text-gray-300 group-hover:text-[#00FF87] transition leading-relaxed line-clamp-2">{article.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-gray-400 hover:shadow-sm transition whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Newspaper size={20} className="text-[#0A1628]" />
            <h2 className="text-xl font-black text-[#0A1628]">Featured Stories</h2>
          </div>
          <Link to="/search" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0A1628] transition">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(featured.length > 0 ? featured : articles).slice(0, 6).map(article => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
      </section>

      {/* Mid-Page Ad */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <AdSlot slotId="homepage-mid" />
      </div>

      {/* Latest + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#0A1628]">Latest News</h2>
            </div>
            <div className="space-y-4">
              {latest.map((article, i) => (
                <React.Fragment key={article.id}>
                  <ArticleCard article={article} variant="horizontal" />
                  {i === 3 && <AdSlot slotId="in-article" className="my-4" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-orange-500" />
                <h3 className="text-base font-bold text-[#0A1628]">Trending Now</h3>
              </div>
              <div className="space-y-0">
                {trending.slice(0, 5).map((article, i) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="flex gap-3 py-3 border-b border-gray-50 last:border-0 group">
                    <span className="text-2xl font-black text-gray-200 group-hover:text-[#00FF87] transition w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A1628] group-hover:text-[#00897B] transition line-clamp-2 leading-snug">{article.title}</h4>
                      <span className="text-[10px] text-gray-400 mt-1 block">{article.category?.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <AdSlot slotId="sidebar-top" />

            {/* Categories Box */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-base font-bold text-[#0A1628] mb-4">Browse by League</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#0A1628]">{cat.name}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#0A1628] transition" />
                  </Link>
                ))}
              </div>
            </div>

            <AdSlot slotId="sidebar-bottom" />
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {['premier-league', 'champions-league', 'transfer-news'].map(catSlug => {
        const cat = CATEGORIES.find(c => c.slug === catSlug);
        const catArticles = articles.filter(a => a.category?.slug === catSlug);
        if (!cat || catArticles.length === 0) return null;
        return (
          <section key={catSlug} className="max-w-7xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                <h2 className="text-lg font-black text-[#0A1628]">{cat.name}</h2>
              </div>
              <Link to={`/category/${catSlug}`} className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0A1628] transition">
                More <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catArticles.slice(0, 4).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdSlot slotId="footer-banner" />
      </div>
    </div>
  );
}
