'use client';

import { useState } from 'react';

export default function AdminHeader({ title }: { title: string }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-chalk-dark border-b border-chalk-gray/20 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border border-chalk-gray/30 px-4 py-2 pr-10 text-sm focus:outline-none focus:border-chalk-white transition-colors w-64"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-chalk-gray">
              🔍
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-chalk-white/5 rounded transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-4 border-l border-chalk-gray/20">
            <div className="w-8 h-8 bg-chalk-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">Admin</div>
              <div className="text-xs text-chalk-gray">Super Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
