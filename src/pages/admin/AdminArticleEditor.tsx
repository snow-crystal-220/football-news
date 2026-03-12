import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Image, Globe, Clock } from 'lucide-react';
import { getArticleBySlug, createArticle, updateArticle, getCategories } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Article, Category } from '@/lib/types';

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    body: '',
    excerpt: '',
    featured_image: '',
    featured_image_caption: '',
    category_id: '',
    status: 'draft' as string,
    is_featured: false,
    is_breaking: false,
    is_trending: false,
    is_sponsored: false,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    social_image: '',
    scheduled_at: '',
  });

  useEffect(() => {
    async function load() {
      const cats = await getCategories();
      setCategories(cats);

      if (isEdit) {
        const { data } = await supabase.from('articles').select('*').eq('id', id).single();
        if (data) {
          setForm({
            title: data.title || '',
            slug: data.slug || '',
            subtitle: data.subtitle || '',
            body: data.body || '',
            excerpt: data.excerpt || '',
            featured_image: data.featured_image || '',
            featured_image_caption: data.featured_image_caption || '',
            category_id: data.category_id || '',
            status: data.status || 'draft',
            is_featured: data.is_featured || false,
            is_breaking: data.is_breaking || false,
            is_trending: data.is_trending || false,
            is_sponsored: data.is_sponsored || false,
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            canonical_url: data.canonical_url || '',
            social_image: data.social_image || '',
            scheduled_at: data.scheduled_at || '',
          });
        }
      }
      setLoading(false);
    }
    load();
  }, [id, isEdit]);

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title),
      meta_title: prev.meta_title || title,
    }));
  };

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    try {
      const articleData: any = {
        ...form,
        author_id: user?.id,
        category_id: form.category_id || null,
        scheduled_at: form.scheduled_at || null,
        canonical_url: form.canonical_url || null,
        social_image: form.social_image || null,
      };

      if (publishNow) {
        articleData.status = 'published';
        articleData.published_at = new Date().toISOString();
      }

      if (isEdit) {
        await updateArticle(id!, articleData);
      } else {
        await createArticle(articleData);
      }
      navigate('/admin/articles');
    } catch (err) {
      console.error('Failed to save article:', err);
      alert('Failed to save article. Please check all required fields.');
    }
    setSaving(false);
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/articles')} className="p-2 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-[#0A1628]">{isEdit ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {form.slug && (
            <a href={`/article/${form.slug}`} target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Eye size={14} /> Preview
            </a>
          )}
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-4 py-2 text-sm font-bold bg-[#00FF87] text-[#0A1628] rounded-lg hover:bg-[#00FF87]/90 transition disabled:opacity-50">
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['content', 'seo', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition capitalize ${
              activeTab === tab ? 'bg-white text-[#0A1628] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          {activeTab === 'content' && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Enter article title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">/article/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Optional subtitle..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Brief summary for cards and previews..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Body (HTML)</label>
                  <textarea
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    placeholder="<p>Write your article content here...</p>"
                    rows={16}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-y"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'seo' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-[#00897B]" />
                <h3 className="text-sm font-bold text-[#0A1628]">SEO Settings</h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="SEO title (50-60 characters)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                />
                <p className="text-[10px] text-gray-400 mt-1">{form.meta_title.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={e => setForm({ ...form, meta_description: e.target.value })}
                  placeholder="SEO description (150-160 characters)"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">{form.meta_description.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Canonical URL</label>
                <input
                  type="url"
                  value={form.canonical_url}
                  onChange={e => setForm({ ...form, canonical_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Social Share Image URL</label>
                <input
                  type="url"
                  value={form.social_image}
                  onChange={e => setForm({ ...form, social_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                />
              </div>

              {/* SEO Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Google Preview</p>
                <div>
                  <p className="text-blue-700 text-base font-medium truncate">{form.meta_title || form.title || 'Article Title'}</p>
                  <p className="text-green-700 text-xs truncate">footballpulse.com/article/{form.slug || 'article-slug'}</p>
                  <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{form.meta_description || form.excerpt || 'Article description will appear here...'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Schedule Publication</label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ''}
                  onChange={e => setForm({ ...form, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600">Article Flags</p>
                {[
                  { key: 'is_featured', label: 'Featured Article' },
                  { key: 'is_breaking', label: 'Breaking News' },
                  { key: 'is_trending', label: 'Trending' },
                  { key: 'is_sponsored', label: 'Sponsored Content' },
                ].map(flag => (
                  <label key={flag.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as any)[flag.key]}
                      onChange={e => setForm({ ...form, [flag.key]: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#00FF87] focus:ring-[#00FF87]"
                    />
                    <span className="text-sm text-gray-700">{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-[#0A1628] mb-3">Status</h3>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-[#0A1628] mb-3">Category</h3>
            <select
              value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-[#0A1628] mb-3">Featured Image</h3>
            <input
              type="url"
              value={form.featured_image}
              onChange={e => setForm({ ...form, featured_image: e.target.value })}
              placeholder="Image URL..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] mb-2"
            />
            {form.featured_image && (
              <img src={form.featured_image} alt="Preview" className="w-full aspect-video object-cover rounded-lg" />
            )}
            <input
              type="text"
              value={form.featured_image_caption}
              onChange={e => setForm({ ...form, featured_image_caption: e.target.value })}
              placeholder="Image caption..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-2 focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
