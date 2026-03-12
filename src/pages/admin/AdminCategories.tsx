import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { slugify } from '@/lib/utils';
import type { Category } from '@/lib/types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#00FF87' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    try {
      if (editId) {
        const updated = await updateCategory(editId, form);
        setCategories(categories.map(c => c.id === editId ? updated : c));
        setEditId(null);
      } else {
        const created = await createCategory({ ...form, slug: form.slug || slugify(form.name) });
        setCategories([...categories, created]);
        setShowNew(false);
      }
      setForm({ name: '', slug: '', description: '', color: '#00FF87' });
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save. Category name or slug may already exist.');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color });
    setShowNew(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Cannot delete category with existing articles.');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setShowNew(false);
    setForm({ name: '', slug: '', description: '', color: '#00FF87' });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#0A1628]">Categories</h1>
          <p className="text-sm text-gray-500">{categories.length} categories</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditId(null); setForm({ name: '', slug: '', description: '', color: '#00FF87' }); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#00FF87] text-[#0A1628] text-sm font-bold rounded-lg hover:bg-[#00FF87]/90 transition">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* New/Edit Form */}
      {(showNew || editId) && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-[#0A1628] mb-4">{editId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : slugify(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
                <input type="text" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF87]" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-[#0A1628] text-white text-sm font-semibold rounded-lg hover:bg-[#0A1628]/90 transition">
              <Save size={14} /> Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Category</th>
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Slug</th>
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Description</th>
              <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-semibold text-[#0A1628]">{cat.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-gray-500">{cat.slug}</span></td>
                <td className="px-3 py-3 hidden lg:table-cell"><span className="text-xs text-gray-500 truncate max-w-xs block">{cat.description || '-'}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition"><Edit size={14} /></button>
                    {deleteConfirm === cat.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(cat.id)} className="px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded">Delete</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[10px] font-bold bg-gray-200 text-gray-600 rounded">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
