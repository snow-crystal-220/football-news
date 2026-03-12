import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME, CATEGORIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Stay in the Game</h3>
              <p className="text-gray-400 text-sm mt-1">Get breaking news and analysis delivered to your inbox.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed! Thank you for joining Football Pulse.'); }} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
              />
              <button type="submit" className="px-6 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#00FF87] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0A1628">
                  <circle cx="12" cy="12" r="10" stroke="#0A1628" strokeWidth="2" fill="none" />
                  <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill="#0A1628" />
                </svg>
              </div>
              <span className="text-lg font-black">{SITE_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier source for football news, transfer updates, match reports, and expert analysis from leagues around the world.
            </p>
            <div className="flex gap-3 mt-5">
              {['twitter', 'facebook', 'instagram', 'youtube'].map(social => (
                <a key={social} href={`https://${social}.com/footballpulse`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#00FF87] hover:text-[#0A1628] rounded-lg flex items-center justify-center text-gray-400 transition text-xs font-bold uppercase">
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Leagues</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-[#00FF87] transition">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/category/transfer-news" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Transfer News</Link></li>
              <li><Link to="/category/match-reports" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Match Reports</Link></li>
              <li><Link to="/search" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Search</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-[#00FF87] transition">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Contact</Link></li>
              <li><Link to="/advertise" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Advertise</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Cookie Policy</Link></li>
              <li><Link to="/admin" className="text-sm text-gray-400 hover:text-[#00FF87] transition">Admin CMS</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built for the beautiful game.</p>
        </div>
      </div>
    </footer>
  );
}
