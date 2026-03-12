import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Zap, TrendingUp } from 'lucide-react';
import type { Article } from '@/lib/types';
import { formatRelativeTime, formatViewCount, truncate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal' | 'hero';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const categoryName = article.category?.name || 'News';
  const categoryColor = article.category?.color || '#00FF87';
  const authorName = article.author?.display_name || 'Football Pulse';

  if (variant === 'hero') {
    return (
      <Link to={`/article/${article.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[21/9]">
        <img src={article.featured_image || ''} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            {article.is_breaking && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded animate-pulse">
                <Zap size={10} /> Breaking
              </span>
            )}
            <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded" style={{ backgroundColor: categoryColor, color: '#0A1628' }}>
              {categoryName}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight group-hover:text-[#00FF87] transition-colors max-w-3xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gray-300 text-sm md:text-base mt-3 max-w-2xl hidden md:block">{truncate(article.excerpt, 150)}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <span className="font-medium text-white/80">{authorName}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(article.published_at || article.created_at)}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {formatViewCount(article.view_count)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.slug}`} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative aspect-[3/2] overflow-hidden">
          <img src={article.featured_image || ''} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {article.is_breaking && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                <Zap size={8} /> Live
              </span>
            )}
            {article.is_trending && (
              <span className="flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                <TrendingUp size={8} /> Trending
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: categoryColor }}>{categoryName}</span>
          <h3 className="text-base font-bold text-[#0A1628] mt-1.5 leading-snug group-hover:text-[#00897B] transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-500 text-xs mt-2 line-clamp-2">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
            <span className="font-medium text-gray-600">{authorName}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(article.published_at || article.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img src={article.featured_image || ''} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: categoryColor }}>{categoryName}</span>
          <h4 className="text-sm font-bold text-[#0A1628] mt-0.5 leading-snug group-hover:text-[#00897B] transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="text-[10px] text-gray-400 mt-1 block">{formatRelativeTime(article.published_at || article.created_at)}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all">
        <div className="w-32 md:w-48 h-24 md:h-32 rounded-lg overflow-hidden shrink-0">
          <img src={article.featured_image || ''} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: categoryColor }}>{categoryName}</span>
          <h3 className="text-base md:text-lg font-bold text-[#0A1628] mt-1 leading-snug group-hover:text-[#00897B] transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 hidden md:block">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
            <span className="font-medium text-gray-600">{authorName}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(article.published_at || article.created_at)}</span>
            <span className="flex items-center gap-1"><Eye size={10} /> {formatViewCount(article.view_count)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link to={`/article/${article.slug}`} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img src={article.featured_image || ''} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ backgroundColor: categoryColor, color: '#0A1628' }}>
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#0A1628] leading-snug group-hover:text-[#00897B] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-400">
          <span>{authorName}</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(article.published_at || article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
