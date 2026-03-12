import React, { useEffect, useState } from 'react';
import { Edit, Save, X, Megaphone } from 'lucide-react';
import { getAdPlacements, updateAdPlacement } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { AdPlacement } from '@/lib/types';

export default function AdminAds() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ content: '', is_active: true, ad_type: 'html' as string });

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    try {
      const { data } = await supabase.from('ad_placements').select('*').order('created_at');
      setAds((data || []) as AdPlacement[]);
    } catch (err) {
      console.error('Failed to load ads:', err);
    }
    setLoading(false);
  }

  const handleEdit = (ad: AdPlacement) => {
    setEditId(ad.id);
    setForm({ content: ad.content || '', is_active: ad.is_active, ad_type: ad.ad_type });
  };

  const handleSave = async () => {
    if (!editId) return;
    try {
      const updated = await updateAdPlacement(editId, form);
      setAds(ads.map(a => a.id === editId ? updated : a));
      setEditId(null);
    } catch (err) {
      console.error('Failed to update ad:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[#0A1628]">Ad Placements</h1>
        <p className="text-sm text-gray-500">Manage advertising slots across the website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className={`bg-white rounded-xl border ${ad.is_active ? 'border-green-200' : 'border-gray-200'} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className={ad.is_active ? 'text-green-500' : 'text-gray-400'} />
                <h3 className="text-sm font-bold text-[#0A1628]">{ad.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${ad.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {ad.is_active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => handleEdit(ad)} className="p-1.5 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition">
                  <Edit size={14} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p><span className="font-medium">Slot:</span> {ad.slot_id}</p>
              <p><span className="font-medium">Placement:</span> {ad.placement}</p>
              <p><span className="font-medium">Type:</span> {ad.ad_type}</p>
            </div>

            {editId === ad.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Type</label>
                  <select value={form.ad_type} onChange={e => setForm({ ...form, ad_type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]">
                    <option value="html">HTML</option>
                    <option value="image">Image</option>
                    <option value="script">Script</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Content (HTML/Script)</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#00FF87] resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#00FF87] focus:ring-[#00FF87]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-[#0A1628] text-white text-xs font-semibold rounded-lg hover:bg-[#0A1628]/90 transition"><Save size={12} /> Save</button>
                  <button onClick={() => setEditId(null)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition"><X size={12} /> Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
