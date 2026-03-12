import React, { useEffect, useState } from 'react';
import { Shield, User, Edit } from 'lucide-react';
import { getAdminUsers } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminUser } from '@/lib/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#00FF87] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    editor: 'bg-blue-100 text-blue-700',
    author: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[#0A1628]">Users</h1>
        <p className="text-sm text-gray-500">{users.length} team members</p>
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">Only administrators can manage user accounts.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-lg font-bold">
                {user.display_name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A1628]">{user.display_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${roleColors[user.role] || 'bg-gray-100 text-gray-500'}`}>
                {user.role}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {user.bio && (
              <p className="text-xs text-gray-500 mt-3 line-clamp-2">{user.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
