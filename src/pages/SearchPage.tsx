import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { getArticles } from '@/lib/api';
import type { Article } from '@/lib/types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query) {
        setArticles([]);
        return;
      }
      setLoading(true);
      try {
        const results = await getArticles({ search: query, limit: 30 });
        setArticles(results);
      } catch (err) {
        console.error('Search failed:', err);
      }
      setLoading(false);
    }
    search();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Search</span>
          </nav>
          <h1 className="text-3xl font-black mb-6">Search Articles</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for news, teams, players..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
                autoFocus
              />
            </div>
            <button type="submit" className="px-8 py-3 bg-[#00FF87] text-[#0A1628] font-bold rounded-xl hover:bg-[#00FF87]/90 transition">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {query && (
          <p className="text-sm text-gray-500 mb-6">
            {loading ? 'Searching...' : `${articles.length} results for "${query}"`}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-[#0A1628] mb-2">No results found</h2>
            <p className="text-gray-500">Try different keywords or browse our categories.</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-[#0A1628] mb-2">Start searching</h2>
            <p className="text-gray-500">Enter keywords to find articles, teams, and players.</p>
          </div>
        )}
      </div>
    </div>
  );
}
