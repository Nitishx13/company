'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const websiteStats = {
  visitors: 12450,
  pageViews: 45230,
  avgSessionDuration: '3m 24s',
  bounceRate: '42%',
};

const topPages = [
  { page: '/services', views: 8450, avgTime: '4m 12s', bounceRate: '38%' },
  { page: '/', views: 7230, avgTime: '2m 45s', bounceRate: '45%' },
  { page: '/work', views: 5120, avgTime: '3m 30s', bounceRate: '40%' },
  { page: '/about', views: 3890, avgTime: '2m 15s', bounceRate: '48%' },
  { page: '/contact', views: 3240, avgTime: '5m 20s', bounceRate: '25%' },
];

const trafficSources = [
  { source: 'Organic Search', visitors: 5420, percentage: 43.5 },
  { source: 'Direct', visitors: 3240, percentage: 26.0 },
  { source: 'Social Media', visitors: 2180, percentage: 17.5 },
  { source: 'Referral', visitors: 1120, percentage: 9.0 },
  { source: 'Email', visitors: 490, percentage: 4.0 },
];

const conversions = [
  { type: 'Contact Form', count: 127, rate: '1.02%' },
  { type: 'Service Enquiry', count: 89, rate: '0.72%' },
  { type: 'Newsletter Signup', count: 234, rate: '1.88%' },
  { type: 'Resource Download', count: 156, rate: '1.25%' },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');

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
        <AdminHeader title="Analytics" />
        
        <main className="p-8">
          {/* Time Range Selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-mono text-chalk-gray">TIME RANGE:</span>
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-mono border transition-colors ${
                  timeRange === range
                    ? 'border-chalk-white bg-chalk-white text-chalk-black'
                    : 'border-chalk-gray/30 text-chalk-gray hover:border-chalk-white hover:text-chalk-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Website Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">TOTAL VISITORS</div>
              <div className="text-3xl font-bold mb-1">{websiteStats.visitors.toLocaleString()}</div>
              <div className="text-xs text-green-400">+15% vs previous period</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">PAGE VIEWS</div>
              <div className="text-3xl font-bold mb-1">{websiteStats.pageViews.toLocaleString()}</div>
              <div className="text-xs text-green-400">+12% vs previous period</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">AVG SESSION</div>
              <div className="text-3xl font-bold mb-1">{websiteStats.avgSessionDuration}</div>
              <div className="text-xs text-green-400">+8% vs previous period</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">BOUNCE RATE</div>
              <div className="text-3xl font-bold mb-1">{websiteStats.bounceRate}</div>
              <div className="text-xs text-yellow-400">-3% vs previous period</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <div className="bg-chalk-black border border-chalk-gray/20">
              <div className="p-6 border-b border-chalk-gray/20">
                <h2 className="text-xl font-bold">Top Pages</h2>
              </div>
              <div className="divide-y divide-chalk-gray/20">
                {topPages.map((page, idx) => (
                  <div key={idx} className="p-6 hover:bg-chalk-white/5 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm">{page.page}</span>
                      <span className="text-2xl font-bold">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-chalk-gray">
                      <div>
                        <span className="text-xs">Avg Time: </span>
                        <span className="text-chalk-white">{page.avgTime}</span>
                      </div>
                      <div>
                        <span className="text-xs">Bounce: </span>
                        <span className="text-chalk-white">{page.bounceRate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-chalk-black border border-chalk-gray/20">
              <div className="p-6 border-b border-chalk-gray/20">
                <h2 className="text-xl font-bold">Traffic Sources</h2>
              </div>
              <div className="p-6 space-y-6">
                {trafficSources.map((source, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{source.source}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">{source.visitors.toLocaleString()}</span>
                        <span className="text-sm text-chalk-gray">{source.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-chalk-gray/10 overflow-hidden">
                      <div
                        className="h-full bg-chalk-white transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversions */}
          <div className="bg-chalk-black border border-chalk-gray/20">
            <div className="p-6 border-b border-chalk-gray/20">
              <h2 className="text-xl font-bold">Conversion Tracking</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              {conversions.map((conversion, idx) => (
                <div key={idx} className="text-center p-6 border border-chalk-gray/20">
                  <div className="text-3xl font-bold mb-2">{conversion.count}</div>
                  <div className="text-sm text-chalk-gray mb-1">{conversion.type}</div>
                  <div className="text-xs text-green-400">{conversion.rate} conversion rate</div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Browser Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <h3 className="text-lg font-bold mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Desktop</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '58%' }} />
                    </div>
                    <span className="w-12 text-right">58%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '32%' }} />
                    </div>
                    <span className="w-12 text-right">32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tablet</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '10%' }} />
                    </div>
                    <span className="w-12 text-right">10%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <h3 className="text-lg font-bold mb-6">Top Browsers</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Chrome</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '65%' }} />
                    </div>
                    <span className="w-12 text-right">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Safari</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '20%' }} />
                    </div>
                    <span className="w-12 text-right">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Firefox</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '10%' }} />
                    </div>
                    <span className="w-12 text-right">10%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Edge</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-chalk-gray/10 overflow-hidden">
                      <div className="h-full bg-chalk-white" style={{ width: '5%' }} />
                    </div>
                    <span className="w-12 text-right">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
