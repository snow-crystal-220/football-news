import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SITE_NAME, CATEGORIES } from '@/lib/constants';
import { Search, Menu, X, ChevronDown, TrendingUp, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catDropdown, setCatDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="bg-[#0A1628] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0">
            <Zap size={10} /> Breaking
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block text-xs text-gray-300">
              Arsenal go top of the Premier League with dramatic late winner &nbsp;&bull;&nbsp; Real Madrid complete record-breaking transfer &nbsp;&bull;&nbsp; Champions League quarter-final draw produces blockbuster ties &nbsp;&bull;&nbsp; Serie A title race blown wide open
            </div>
          </div>
        </div>
      </div>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-[#00FF87] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A1628">
                  <circle cx="12" cy="12" r="10" stroke="#0A1628" strokeWidth="2" fill="none" />
                  <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill="#0A1628" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black text-[#0A1628] tracking-tight">{SITE_NAME}</span>
                <span className="hidden sm:block text-[9px] text-gray-400 uppercase tracking-widest -mt-1">Your Pulse on the Beautiful Game</span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${isActive('/') ? 'text-[#0A1628] bg-gray-100' : 'text-gray-600 hover:text-[#0A1628] hover:bg-gray-50'}`}>Home</Link>
              <div className="relative" onMouseEnter={() => setCatDropdown(true)} onMouseLeave={() => setCatDropdown(false)}>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#0A1628] hover:bg-gray-50 rounded-lg transition">
                  Leagues <ChevronDown size={14} />
                </button>
                {catDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug} to={`/category/${cat.slug}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setCatDropdown(false)}>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/category/transfer-news" className={`px-3 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${isActive('/category/transfer-news') ? 'text-[#0A1628] bg-gray-100' : 'text-gray-600 hover:text-[#0A1628] hover:bg-gray-50'}`}>
                <TrendingUp size={14} /> Transfers
              </Link>
              <Link to="/category/match-reports" className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${isActive('/category/match-reports') ? 'text-[#0A1628] bg-gray-100' : 'text-gray-600 hover:text-[#0A1628] hover:bg-gray-50'}`}>Match Reports</Link>
              <Link to="/about" className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${isActive('/about') ? 'text-[#0A1628] bg-gray-100' : 'text-gray-600 hover:text-[#0A1628] hover:bg-gray-50'}`}>About</Link>
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-500 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition"><Search size={20} /></button>
              <Link to="/admin/login" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-[#0A1628] border border-gray-200 hover:border-gray-300 rounded-lg transition">CMS</Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-500 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles, teams, players..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] focus:border-transparent" autoFocus />
                <button type="submit" className="px-6 py-2.5 bg-[#0A1628] text-white text-sm font-semibold rounded-xl hover:bg-[#0A1628]/90 transition">Search</button>
              </form>
            </div>
          )}
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
              {CATEGORIES.map(cat => (
                <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />{cat.name}
                </Link>
              ))}
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Contact</Link>
              <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-gray-50 rounded-lg">Admin CMS</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
