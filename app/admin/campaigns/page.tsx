'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const campaigns = [
  {
    id: 1,
    name: 'AI Services Launch',
    type: 'Email',
    status: 'active',
    sent: 2450,
    opened: 1225,
    clicked: 367,
    converted: 45,
    budget: '$2,500',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
  },
  {
    id: 2,
    name: 'LinkedIn Ads - Tech Startups',
    type: 'Social',
    status: 'active',
    impressions: 45000,
    clicks: 1200,
    leads: 85,
    budget: '$5,000',
    startDate: '2025-10-05',
    endDate: '2025-11-05',
  },
  {
    id: 3,
    name: 'Content Marketing - AI Blog',
    type: 'Content',
    status: 'completed',
    views: 12500,
    shares: 450,
    leads: 120,
    budget: '$1,500',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
  {
    id: 4,
    name: 'Google Ads - UX Design',
    type: 'PPC',
    status: 'paused',
    impressions: 28000,
    clicks: 840,
    conversions: 32,
    budget: '$3,000',
    startDate: '2025-09-15',
    endDate: '2025-10-15',
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNewCampaign, setShowNewCampaign] = useState(false);

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
        <AdminHeader title="Marketing Campaigns" />
        
        <main className="p-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 border border-chalk-white bg-chalk-white text-chalk-black font-mono text-sm">
                ALL CAMPAIGNS
              </button>
              <button className="px-4 py-2 border border-chalk-gray/30 text-chalk-gray hover:border-chalk-white hover:text-chalk-white font-mono text-sm">
                ACTIVE
              </button>
              <button className="px-4 py-2 border border-chalk-gray/30 text-chalk-gray hover:border-chalk-white hover:text-chalk-white font-mono text-sm">
                COMPLETED
              </button>
            </div>

            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-6 py-3 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all font-mono text-sm"
            >
              + NEW CAMPAIGN
            </button>
          </div>

          {/* Campaign Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm text-chalk-gray">Total Campaigns</div>
            </div>
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-3xl font-bold mb-1">4</div>
              <div className="text-sm text-chalk-gray">Active Campaigns</div>
            </div>
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-3xl font-bold mb-1">$12,000</div>
              <div className="text-sm text-chalk-gray">Total Budget</div>
            </div>
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-3xl font-bold mb-1">282</div>
              <div className="text-sm text-chalk-gray">Total Leads</div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-chalk-black border border-chalk-gray/20 p-6 hover:border-chalk-white/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-chalk-gray">
                      <span className="font-mono">{campaign.type}</span>
                      <span>•</span>
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                      <span>•</span>
                      <span>Budget: {campaign.budget}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-mono border ${
                    campaign.status === 'active' ? 'border-green-400 text-green-400' :
                    campaign.status === 'completed' ? 'border-blue-400 text-blue-400' :
                    'border-yellow-400 text-yellow-400'
                  }`}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {campaign.type === 'Email' && (
                    <>
                      <div>
                        <div className="text-2xl font-bold">{campaign.sent?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Sent</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.opened?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Opened ({((campaign.opened! / campaign.sent!) * 100).toFixed(1)}%)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.clicked?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Clicked ({((campaign.clicked! / campaign.sent!) * 100).toFixed(1)}%)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.converted}</div>
                        <div className="text-xs text-chalk-gray">Converted ({((campaign.converted! / campaign.sent!) * 100).toFixed(1)}%)</div>
                      </div>
                    </>
                  )}

                  {campaign.type === 'Social' && (
                    <>
                      <div>
                        <div className="text-2xl font-bold">{campaign.impressions?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Impressions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.clicks?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Clicks ({((campaign.clicks! / campaign.impressions!) * 100).toFixed(2)}%)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.leads}</div>
                        <div className="text-xs text-chalk-gray">Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">${(parseFloat(campaign.budget.replace(/[$,]/g, '')) / campaign.leads!).toFixed(2)}</div>
                        <div className="text-xs text-chalk-gray">Cost per Lead</div>
                      </div>
                    </>
                  )}

                  {campaign.type === 'Content' && (
                    <>
                      <div>
                        <div className="text-2xl font-bold">{campaign.views?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Views</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.shares?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Shares</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.leads}</div>
                        <div className="text-xs text-chalk-gray">Leads Generated</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{((campaign.leads! / campaign.views!) * 100).toFixed(2)}%</div>
                        <div className="text-xs text-chalk-gray">Conversion Rate</div>
                      </div>
                    </>
                  )}

                  {campaign.type === 'PPC' && (
                    <>
                      <div>
                        <div className="text-2xl font-bold">{campaign.impressions?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Impressions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.clicks?.toLocaleString()}</div>
                        <div className="text-xs text-chalk-gray">Clicks</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.conversions}</div>
                        <div className="text-xs text-chalk-gray">Conversions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">${(parseFloat(campaign.budget.replace(/[$,]/g, '')) / campaign.conversions!).toFixed(2)}</div>
                        <div className="text-xs text-chalk-gray">Cost per Conversion</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <button className="px-4 py-2 border border-chalk-gray/30 text-sm hover:border-chalk-white transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-chalk-gray/30 text-sm hover:border-chalk-white transition-colors">
                    Edit
                  </button>
                  {campaign.status === 'active' && (
                    <button className="px-4 py-2 border border-yellow-400 text-yellow-400 text-sm hover:bg-yellow-400 hover:text-chalk-black transition-colors">
                      Pause
                    </button>
                  )}
                  {campaign.status === 'paused' && (
                    <button className="px-4 py-2 border border-green-400 text-green-400 text-sm hover:bg-green-400 hover:text-chalk-black transition-colors">
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
