import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Share2, ChevronRight, ArrowLeft, Twitter, Facebook, Link as LinkIcon, Bookmark } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { getArticleBySlug, getRelatedArticles } from '@/lib/api';
import { formatDate, formatRelativeTime, formatViewCount } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { Article } from '@/lib/types';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const art = await getArticleBySlug(slug);
        setArticle(art);
        if (art?.category_id) {
          const rel = await getRelatedArticles(art.id, art.category_id);
          setRelated(rel);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = `${SITE_URL}/article/${slug}`;
    const title = article?.title || '';
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-bold text-[#0A1628]">Article Not Found</h1>
        <p className="text-gray-500">The article you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-semibold hover:bg-[#0A1628]/90 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  const categoryColor = article.category?.color || '#00FF87';

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { '@type': 'Person', name: article.author?.display_name },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/article/${article.slug}` },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#0A1628] transition">Home</Link>
          <ChevronRight size={12} />
          {article.category && (
            <>
              <Link to={`/category/${article.category.slug}`} className="hover:text-[#0A1628] transition">{article.category.name}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-gray-600 truncate max-w-xs">{article.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Header */}
            <header className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded" style={{ backgroundColor: categoryColor, color: '#0A1628' }}>
                  {article.category?.name || 'News'}
                </span>
                {article.is_sponsored && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">Sponsored</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0A1628] leading-tight">{article.title}</h1>
              {article.subtitle && (
                <p className="text-lg text-gray-500 mt-3 leading-relaxed">{article.subtitle}</p>
              )}
              <div className="flex items-center gap-4 mt-5 pb-5 border-b border-gray-200">
                <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {article.author?.display_name?.charAt(0) || 'F'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1628]">{article.author?.display_name || 'Football Pulse'}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {formatRelativeTime(article.published_at || article.created_at)}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {formatViewCount(article.view_count)} views</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img src={article.featured_image} alt={article.title} className="w-full aspect-[16/9] object-cover" />
                {article.featured_image_caption && (
                  <p className="text-xs text-gray-400 mt-2 italic">{article.featured_image_caption}</p>
                )}
              </div>
            )}

            {/* Share Bar */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-400 font-medium mr-1">Share:</span>
              <button onClick={() => handleShare('twitter')} className="p-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition text-gray-500">
                <Twitter size={16} />
              </button>
              <button onClick={() => handleShare('facebook')} className="p-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition text-gray-500">
                <Facebook size={16} />
              </button>
              <button onClick={() => handleShare('copy')} className="p-2 bg-gray-100 hover:bg-green-50 hover:text-green-600 rounded-lg transition text-gray-500 relative">
                <LinkIcon size={16} />
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-[#0A1628] text-white px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
              </button>
            </div>

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#0A1628] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-[#0A1628]"
              dangerouslySetInnerHTML={{ __html: article.body || '' }}
            />

            {/* In-Article Ad */}
            <AdSlot slotId="in-article" className="my-8" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
              <span className="text-xs text-gray-400 font-medium">Tags:</span>
              {(article.category ? [article.category.name] : ['Football']).map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Bio */}
            {article.author && (
              <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {article.author.display_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1628]">{article.author.display_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{article.author.bio || 'Football journalist at Football Pulse.'}</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot slotId="sidebar-top" />

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-base font-bold text-[#0A1628] mb-4">Related Articles</h3>
                <div className="space-y-0">
                  {related.map(art => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            <AdSlot slotId="sidebar-bottom" />
          </aside>
        </div>
      </div>
    </div>
  );
}
