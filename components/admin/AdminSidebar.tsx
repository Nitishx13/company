'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  {
    section: 'Overview',
    items: [
      { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
      { icon: '📈', label: 'Analytics', href: '/admin/analytics' },
    ],
  },
  {
    section: 'Business',
    items: [
      { icon: '📧', label: 'Enquiries', href: '/admin/enquiries' },
      { icon: '👥', label: 'Clients', href: '/admin/clients' },
      { icon: '📁', label: 'Projects', href: '/admin/projects' },
    ],
  },
  {
    section: 'Marketing',
    items: [
      { icon: '🎯', label: 'Campaigns', href: '/admin/campaigns' },
      { icon: '📱', label: 'Social Media', href: '/admin/social' },
      { icon: '✉️', label: 'Email Marketing', href: '/admin/email' },
    ],
  },
  {
    section: 'Finance',
    items: [
      { icon: '💰', label: 'Revenue', href: '/admin/revenue' },
      { icon: '💳', label: 'Invoices', href: '/admin/invoices' },
      { icon: '📊', label: 'Expenses', href: '/admin/expenses' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
      { icon: '👤', label: 'Profile', href: '/admin/profile' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  return (
    <aside className="w-64 bg-chalk-black border-r border-chalk-gray/20 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-chalk-gray/20">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 120 120">
            <rect x="40" y="20" width="40" height="80" className="chalk-line" />
            <line x1="40" y1="60" x2="80" y2="60" className="chalk-line" />
            <circle cx="60" cy="60" r="35" className="chalk-line" />
          </svg>
          <div>
            <div className="font-bold text-sm">PINAQYN</div>
            <div className="text-xs text-chalk-gray font-mono">ADMIN</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="text-xs font-mono text-chalk-gray mb-3 px-3">
              {section.section.toUpperCase()}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                    pathname === item.href
                      ? 'bg-chalk-white/10 text-chalk-white'
                      : 'text-chalk-gray hover:text-chalk-white hover:bg-chalk-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-chalk-gray/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-chalk-gray hover:text-chalk-white transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
