'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const stats = [
  { label: 'Total Enquiries', value: '127', change: '+12%', icon: '📧' },
  { label: 'Active Projects', value: '8', change: '+2', icon: '📁' },
  { label: 'Revenue (MTD)', value: '$45,200', change: '+18%', icon: '💰' },
  { label: 'Conversion Rate', value: '24%', change: '+3%', icon: '📈' },
];

const recentEnquiries = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', service: 'AI Development', date: '2 hours ago', status: 'new' },
  { id: 2, name: 'Mike Chen', email: 'mike@example.com', service: 'UX/UI Design', date: '5 hours ago', status: 'contacted' },
  { id: 3, name: 'Emma Wilson', email: 'emma@example.com', service: 'Systems Architecture', date: '1 day ago', status: 'qualified' },
  { id: 4, name: 'David Brown', email: 'david@example.com', service: 'AI Development', date: '2 days ago', status: 'proposal' },
];

const activeProjects = [
  { id: 1, name: 'NeuroTech AI Platform', client: 'NeuroTech Labs', progress: 75, status: 'on-track' },
  { id: 2, name: 'GreenVest Mobile App', client: 'GreenVest', progress: 45, status: 'on-track' },
  { id: 3, name: 'Climate Dashboard', client: 'Environmental NGO', progress: 90, status: 'review' },
  { id: 4, name: 'E-Commerce Platform', client: 'Artisan Collective', progress: 30, status: 'delayed' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-chalk-dark">
      <AdminSidebar />
      
      <div className="flex-1">
        <AdminHeader title="Dashboard" />
        
        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-chalk-black border border-chalk-gray/20 p-6 hover:border-chalk-white/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-xs font-mono text-green-400">{stat.change}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-chalk-gray">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Enquiries */}
            <div className="bg-chalk-black border border-chalk-gray/20">
              <div className="p-6 border-b border-chalk-gray/20 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Enquiries</h2>
                <a href="/admin/enquiries" className="text-sm text-chalk-gray hover:text-chalk-white">
                  View All →
                </a>
              </div>
              <div className="divide-y divide-chalk-gray/20">
                {recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="p-6 hover:bg-chalk-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{enquiry.name}</div>
                        <div className="text-sm text-chalk-gray">{enquiry.email}</div>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 border ${
                        enquiry.status === 'new' ? 'border-blue-400 text-blue-400' :
                        enquiry.status === 'contacted' ? 'border-yellow-400 text-yellow-400' :
                        enquiry.status === 'qualified' ? 'border-green-400 text-green-400' :
                        'border-purple-400 text-purple-400'
                      }`}>
                        {enquiry.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-chalk-gray mb-1">{enquiry.service}</div>
                    <div className="text-xs text-chalk-gray/70">{enquiry.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-chalk-black border border-chalk-gray/20">
              <div className="p-6 border-b border-chalk-gray/20 flex items-center justify-between">
                <h2 className="text-xl font-bold">Active Projects</h2>
                <a href="/admin/projects" className="text-sm text-chalk-gray hover:text-chalk-white">
                  View All →
                </a>
              </div>
              <div className="divide-y divide-chalk-gray/20">
                {activeProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-chalk-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium mb-1">{project.name}</div>
                        <div className="text-sm text-chalk-gray">{project.client}</div>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 border ${
                        project.status === 'on-track' ? 'border-green-400 text-green-400' :
                        project.status === 'review' ? 'border-blue-400 text-blue-400' :
                        'border-red-400 text-red-400'
                      }`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-chalk-gray mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1 bg-chalk-gray/20 overflow-hidden">
                        <div
                          className="h-full bg-chalk-white transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/admin/enquiries"
              className="bg-chalk-black border border-chalk-gray/20 p-6 hover:border-chalk-white transition-colors group"
            >
              <div className="text-3xl mb-3">📧</div>
              <div className="font-bold mb-2">Manage Enquiries</div>
              <div className="text-sm text-chalk-gray group-hover:text-chalk-white transition-colors">
                Review and respond to customer enquiries
              </div>
            </a>

            <a
              href="/admin/campaigns"
              className="bg-chalk-black border border-chalk-gray/20 p-6 hover:border-chalk-white transition-colors group"
            >
              <div className="text-3xl mb-3">🎯</div>
              <div className="font-bold mb-2">Marketing Campaigns</div>
              <div className="text-sm text-chalk-gray group-hover:text-chalk-white transition-colors">
                Create and track marketing campaigns
              </div>
            </a>

            <a
              href="/admin/revenue"
              className="bg-chalk-black border border-chalk-gray/20 p-6 hover:border-chalk-white transition-colors group"
            >
              <div className="text-3xl mb-3">💰</div>
              <div className="font-bold mb-2">Financial Reports</div>
              <div className="text-sm text-chalk-gray group-hover:text-chalk-white transition-colors">
                View revenue and expense reports
              </div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
