import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MapPin, Phone, Send, Users, Target, Award, Globe } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

function PageWrapper({ title, breadcrumb, children }: { title: string; breadcrumb: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">{breadcrumb}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">{children}</div>
    </div>
  );
}

export function AboutPage() {
  return (
    <PageWrapper title="About Football Pulse" breadcrumb="About">
      <div className="prose prose-lg max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 not-prose">
          {[
            { icon: Users, title: 'Expert Team', desc: 'Our journalists have decades of combined experience covering football at the highest level.' },
            { icon: Target, title: 'Accurate Reporting', desc: 'We verify every story through multiple sources before publishing.' },
            { icon: Award, title: 'Award-Winning', desc: 'Recognised for excellence in sports journalism and digital innovation.' },
            { icon: Globe, title: 'Global Coverage', desc: 'From the Premier League to Serie A, we cover football worldwide.' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-6">
              <item.icon size={28} className="text-[#00FF87] mb-3" />
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2>Our Story</h2>
        <p>{SITE_NAME} was founded with a simple mission: to deliver the most comprehensive, accurate, and engaging football coverage on the web. We believe every fan deserves access to premium sports journalism.</p>
        <p>Our team of experienced journalists, analysts, and football enthusiasts work around the clock to bring you breaking news, in-depth analysis, transfer updates, and match reports from every major league and competition.</p>

        <h2>Our Mission</h2>
        <p>We are committed to providing football fans with the highest quality content, combining traditional journalistic values with modern digital storytelling. Our coverage spans the Premier League, La Liga, Serie A, Bundesliga, Champions League, and international football.</p>

        <h2>Editorial Standards</h2>
        <p>Every article published on {SITE_NAME} undergoes rigorous editorial review. We maintain strict standards of accuracy, fairness, and impartiality. Our journalists adhere to a comprehensive code of ethics that prioritises truth and accountability.</p>
      </div>
    </PageWrapper>
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageWrapper title="Contact Us" breadcrumb="Contact">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-gray-600 mb-8 leading-relaxed">Have a story tip, feedback, or inquiry? We'd love to hear from you. Fill out the form or reach us through the contact details below.</p>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00FF87]/10 rounded-lg flex items-center justify-center"><Mail size={18} className="text-[#00897B]" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-[#0A1628]">contact@footballpulse.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00FF87]/10 rounded-lg flex items-center justify-center"><Phone size={18} className="text-[#00897B]" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-semibold text-[#0A1628]">+44 20 7946 0958</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00FF87]/10 rounded-lg flex items-center justify-center"><MapPin size={18} className="text-[#00897B]" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
                <p className="text-sm font-semibold text-[#0A1628]">10 Fleet Street, London EC4Y 1AU</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">Message Sent!</h3>
              <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="mt-4 text-sm text-[#00897B] font-semibold hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#0A1628] text-white font-semibold rounded-lg hover:bg-[#0A1628]/90 transition text-sm">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export function AdvertisePage() {
  return (
    <PageWrapper title="Advertise With Us" breadcrumb="Advertise">
      <div className="prose prose-lg max-w-none">
        <p className="lead">{SITE_NAME} reaches millions of passionate football fans every month. Partner with us to connect your brand with an engaged, global audience.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
          {[
            { stat: '2.5M+', label: 'Monthly Visitors' },
            { stat: '8.5M+', label: 'Page Views' },
            { stat: '45%', label: 'Mobile Traffic' },
          ].map(item => (
            <div key={item.label} className="bg-[#0A1628] rounded-xl p-6 text-center">
              <p className="text-3xl font-black text-[#00FF87]">{item.stat}</p>
              <p className="text-sm text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <h2>Ad Placement Options</h2>
        <ul>
          <li><strong>Header Leaderboard (728x90)</strong> - Premium above-the-fold placement on all pages</li>
          <li><strong>Sidebar Display (300x250)</strong> - High-visibility placement alongside content</li>
          <li><strong>In-Article Native (728x90)</strong> - Seamlessly integrated within article content</li>
          <li><strong>Homepage Billboard (970x250)</strong> - Maximum impact on our highest-traffic page</li>
          <li><strong>Mobile Sticky (320x50)</strong> - Persistent visibility on mobile devices</li>
          <li><strong>Sponsored Content</strong> - Custom branded articles and features</li>
        </ul>

        <h2>Why Advertise With Us?</h2>
        <ul>
          <li>Highly engaged audience of football enthusiasts</li>
          <li>Premium content environment for brand safety</li>
          <li>Flexible ad formats including display, native, and sponsored content</li>
          <li>Detailed analytics and performance reporting</li>
          <li>Dedicated account management</li>
        </ul>

        <div className="bg-[#00FF87]/10 rounded-xl p-8 text-center not-prose mt-10">
          <h3 className="text-xl font-bold text-[#0A1628] mb-2">Ready to Get Started?</h3>
          <p className="text-sm text-gray-600 mb-4">Contact our advertising team for rates and availability.</p>
          <Link to="/contact" className="inline-block px-8 py-3 bg-[#0A1628] text-white font-semibold rounded-lg hover:bg-[#0A1628]/90 transition text-sm">
            Contact Us
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}

export function PrivacyPage() {
  return (
    <PageWrapper title="Privacy Policy" breadcrumb="Privacy Policy">
      <div className="prose prose-lg max-w-none prose-headings:text-[#0A1628]">
        <p className="text-sm text-gray-400">Last updated: March 2, 2026</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, such as when you subscribe to our newsletter, contact us, or create an account. We also collect certain information automatically when you visit our website, including your IP address, browser type, and browsing behaviour through cookies and similar technologies.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, to personalise your experience, and to serve relevant advertising.</p>
        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share information with service providers who assist us in operating our website, conducting our business, or serving our users.</p>
        <h2>4. Cookies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        <h2>5. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.</p>
        <h2>7. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@footballpulse.com.</p>
      </div>
    </PageWrapper>
  );
}

export function TermsPage() {
  return (
    <PageWrapper title="Terms of Service" breadcrumb="Terms">
      <div className="prose prose-lg max-w-none prose-headings:text-[#0A1628]">
        <p className="text-sm text-gray-400">Last updated: March 2, 2026</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using {SITE_NAME}, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
        <h2>2. Use of Content</h2>
        <p>All content on {SITE_NAME} is protected by copyright. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        <h2>3. User Conduct</h2>
        <p>You agree not to use our website for any unlawful purpose or in any way that could damage, disable, or impair the website.</p>
        <h2>4. Disclaimer</h2>
        <p>The content on {SITE_NAME} is provided for general information purposes only. We make no warranties about the completeness, reliability, or accuracy of this information.</p>
        <h2>5. Limitation of Liability</h2>
        <p>{SITE_NAME} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website.</p>
        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
      </div>
    </PageWrapper>
  );
}

export function CookiePage() {
  return (
    <PageWrapper title="Cookie Policy" breadcrumb="Cookies">
      <div className="prose prose-lg max-w-none prose-headings:text-[#0A1628]">
        <p className="text-sm text-gray-400">Last updated: March 2, 2026</p>
        <h2>What Are Cookies</h2>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.</p>
        <h2>How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
          <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        </ul>
        <h2>Managing Cookies</h2>
        <p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>
        <h2>Third-Party Cookies</h2>
        <p>Some cookies are placed by third-party services that appear on our pages, including analytics providers and advertising networks.</p>
      </div>
    </PageWrapper>
  );
}
