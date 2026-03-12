import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getTags, createTag, deleteTag } from '@/lib/api';
import { slugify } from '@/lib/utils';
import type { Tag } from '@/lib/types';

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
    setLoading(false);
  }

  const handleCreate = async () => {
    if (!newTag.trim()) return;
    try {
      const created = await createTag({ name: newTag.trim(), slug: slugify(newTag.trim()) });
      setTags([...tags, created]);
      setNewTag('');
    } catch (err) {
      console.error('Failed to create tag:', err);
      alert('Tag may already exist.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id);
      setTags(tags.filter(t => t.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete tag:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[#0A1628]">Tags</h1>
        <p className="text-sm text-gray-500">{tags.length} tags</p>
      </div>

      {/* Add Tag */}
      <div className="flex gap-2 max-w-md">
        <input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="New tag name..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]"
        />
        <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <div key={tag.id} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 transition">
            <span className="text-sm text-gray-700">{tag.name}</span>
            <span className="text-[10px] text-gray-400">({tag.slug})</span>
            {deleteConfirm === tag.id ? (
              <div className="flex gap-1 ml-1">
                <button onClick={() => handleDelete(tag.id)} className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded">Yes</button>
                <button onClick={() => setDeleteConfirm(null)} className="px-1.5 py-0.5 text-[9px] font-bold bg-gray-200 text-gray-600 rounded">No</button>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirm(tag.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition">
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
