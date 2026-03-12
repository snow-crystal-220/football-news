import React, { useEffect, useState } from 'react';
import { Save, Settings, Globe, Share2, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('site_settings').select('*');
        const map: Record<string, string> = {};
        (data || []).forEach((s: any) => { map[s.key] = s.value || ''; });
        setSettings(map);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#0A1628]">Site Settings</h1>
          <p className="text-sm text-gray-500">Manage your website configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-[#00897B]" />
          <h3 className="text-sm font-bold text-[#0A1628]">General</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Site Name</label>
          <input type="text" value={settings.site_name || ''} onChange={e => updateSetting('site_name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline</label>
          <input type="text" value={settings.site_tagline || ''} onChange={e => updateSetting('site_tagline', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Site Description</label>
          <textarea value={settings.site_description || ''} onChange={e => updateSetting('site_description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Email</label>
          <input type="email" value={settings.contact_email || ''} onChange={e => updateSetting('contact_email', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Share2 size={16} className="text-[#00897B]" />
          <h3 className="text-sm font-bold text-[#0A1628]">Social Media</h3>
        </div>
        {['twitter', 'facebook', 'instagram', 'youtube'].map(social => (
          <div key={social}>
            <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{social}</label>
            <input type="url" value={settings[`social_${social}`] || ''} onChange={e => updateSetting(`social_${social}`, e.target.value)} placeholder={`https://${social}.com/...`} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
          </div>
        ))}
      </div>

      {/* Analytics & Ads */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={16} className="text-[#00897B]" />
          <h3 className="text-sm font-bold text-[#0A1628]">Analytics & Advertising</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Google Analytics ID</label>
          <input type="text" value={settings.analytics_id || ''} onChange={e => updateSetting('analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.ads_enabled === 'true'} onChange={e => updateSetting('ads_enabled', e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded border-gray-300 text-[#00FF87] focus:ring-[#00FF87]" />
            <span className="text-sm text-gray-700">Enable Advertisements</span>
          </label>
        </div>
      </div>
    </div>
  );
}
