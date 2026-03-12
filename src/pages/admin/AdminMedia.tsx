import React, { useEffect, useState } from 'react';
import { Image, Copy, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IMAGES } from '@/lib/constants';
import type { Media } from '@/lib/types';

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      // Also show article images as available media
      const articleImages = IMAGES.articles.map((url, i) => ({
        id: `img-${i}`,
        filename: `football-image-${i + 1}.jpg`,
        url,
        alt_text: `Football image ${i + 1}`,
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString(),
      }));
      setMedia([...(data || []), ...articleImages] as Media[]);
    } catch (err) {
      console.error('Failed to load media:', err);
    }
    setLoading(false);
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[#0A1628]">Media Library</h1>
        <p className="text-sm text-gray-500">{media.length} files</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> Copy image URLs from here to use in articles. For production, integrate with a cloud storage service for file uploads.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map(item => (
          <div key={item.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img src={item.url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="p-2 bg-white rounded-lg text-[#0A1628] hover:bg-gray-100 transition"
                  title="Copy URL"
                >
                  <Copy size={14} />
                </button>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg text-[#0A1628] hover:bg-gray-100 transition" title="Open">
                  <ExternalLink size={14} />
                </a>
              </div>
              {copied === item.id && (
                <div className="absolute top-2 left-2 right-2 bg-green-500 text-white text-[10px] font-bold text-center py-1 rounded">
                  URL Copied!
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-[10px] text-gray-500 truncate">{item.filename}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
