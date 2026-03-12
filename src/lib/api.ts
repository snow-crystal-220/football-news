import { supabase } from '@/lib/supabase';
import type { Article, Category, Tag, AdPlacement, AdminUser } from '@/lib/types';

export async function getArticles(options?: {
  limit?: number;
  offset?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  featured?: boolean;
  trending?: boolean;
  breaking?: boolean;
  status?: string;
}): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url, bio)')
    .order('published_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  } else {
    query = query.eq('status', 'published');
  }

  if (options?.categorySlug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', options.categorySlug).single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (options?.featured) query = query.eq('is_featured', true);
  if (options?.trending) query = query.eq('is_trending', true);
  if (options?.breaking) query = query.eq('is_breaking', true);

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,body.ilike.%${options.search}%`);
  }

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url, bio)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Article;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return (data || []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data || []) as Tag[];
}

export async function getAdPlacements(): Promise<AdPlacement[]> {
  const { data, error } = await supabase
    .from('ad_placements')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as AdPlacement[];
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit = 4): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Article[];
}

export async function incrementViewCount(articleId: string): Promise<void> {
  await supabase.rpc('increment_view_count', { article_id: articleId }).catch(() => {
    // Fallback: direct update
    supabase.from('articles').update({ view_count: 1 }).eq('id', articleId);
  });
}

// Admin API functions
export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Article[];
}

export async function createArticle(article: Partial<Article>): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url)')
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(*), author:admin_users(id, display_name, avatar_url)')
    .single();

  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createTag(tag: Partial<Tag>): Promise<Tag> {
  const { data, error } = await supabase.from('tags').insert(tag).select().single();
  if (error) throw error;
  return data as Tag;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAdPlacement(id: string, updates: Partial<AdPlacement>): Promise<AdPlacement> {
  const { data, error } = await supabase.from('ad_placements').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as AdPlacement;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, display_name, role, avatar_url, bio, is_active, created_at, updated_at')
    .order('created_at');

  if (error) throw error;
  return (data || []) as AdminUser[];
}
