'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
}

const mockEnquiries: Enquiry[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Inc',
    service: 'AI Development',
    budget: '$50k-$100k',
    message: 'We need an AI solution for customer service automation...',
    date: '2025-10-07 14:30',
    status: 'new',
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@designstudio.com',
    company: 'Design Studio',
    service: 'UX/UI Design',
    budget: '$25k-$50k',
    message: 'Looking for a complete redesign of our mobile app...',
    date: '2025-10-07 10:15',
    status: 'contacted',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma@startup.io',
    company: 'Startup.io',
    service: 'Systems Architecture',
    budget: '$100k+',
    message: 'Need scalable architecture for our SaaS platform...',
    date: '2025-10-06 16:45',
    status: 'qualified',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@enterprise.com',
    company: 'Enterprise Solutions',
    service: 'AI Development',
    budget: '$100k+',
    message: 'Enterprise AI implementation for data analytics...',
    date: '2025-10-05 09:20',
    status: 'proposal',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa@healthtech.com',
    company: 'HealthTech',
    service: 'Mathematical Animations',
    budget: '$10k-$25k',
    message: 'Interactive medical visualizations needed...',
    date: '2025-10-04 11:00',
    status: 'won',
  },
];

export default function EnquiriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const filteredEnquiries = filterStatus === 'all'
    ? enquiries
    : enquiries.filter(e => e.status === filterStatus);

  const updateStatus = (id: number, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map(e => 
      e.id === id ? { ...e, status: newStatus } : e
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-chalk-dark">
      <AdminSidebar />
      
      <div className="flex-1">
        <AdminHeader title="Enquiries" />
        
        <main className="p-8">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="font-mono text-xs text-chalk-gray">FILTER:</div>
            {['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-mono border transition-colors ${
                  filterStatus === status
                    ? 'border-chalk-white bg-chalk-white text-chalk-black'
                    : 'border-chalk-gray/30 text-chalk-gray hover:border-chalk-white hover:text-chalk-white'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enquiries List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`bg-chalk-black border p-6 cursor-pointer transition-all ${
                    selectedEnquiry?.id === enquiry.id
                      ? 'border-chalk-white'
                      : 'border-chalk-gray/20 hover:border-chalk-gray/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg mb-1">{enquiry.name}</div>
                      <div className="text-sm text-chalk-gray">{enquiry.company}</div>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 border ${
                      enquiry.status === 'new' ? 'border-blue-400 text-blue-400' :
                      enquiry.status === 'contacted' ? 'border-yellow-400 text-yellow-400' :
                      enquiry.status === 'qualified' ? 'border-green-400 text-green-400' :
                      enquiry.status === 'proposal' ? 'border-purple-400 text-purple-400' :
                      enquiry.status === 'won' ? 'border-green-500 text-green-500' :
                      'border-red-400 text-red-400'
                    }`}>
                      {enquiry.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <div className="text-chalk-gray text-xs mb-1">SERVICE</div>
                      <div>{enquiry.service}</div>
                    </div>
                    <div>
                      <div className="text-chalk-gray text-xs mb-1">BUDGET</div>
                      <div>{enquiry.budget}</div>
                    </div>
                  </div>

                  <div className="text-sm text-chalk-gray line-clamp-2 mb-3">
                    {enquiry.message}
                  </div>

                  <div className="text-xs text-chalk-gray/70">{enquiry.date}</div>
                </div>
              ))}
            </div>

            {/* Enquiry Details */}
            <div className="lg:col-span-1">
              {selectedEnquiry ? (
                <div className="bg-chalk-black border border-chalk-gray/20 p-6 sticky top-8">
                  <h3 className="text-xl font-bold mb-6">Enquiry Details</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">NAME</div>
                      <div className="font-medium">{selectedEnquiry.name}</div>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">EMAIL</div>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-chalk-white hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">COMPANY</div>
                      <div>{selectedEnquiry.company}</div>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">SERVICE</div>
                      <div>{selectedEnquiry.service}</div>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">BUDGET</div>
                      <div>{selectedEnquiry.budget}</div>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">MESSAGE</div>
                      <div className="text-sm text-chalk-gray">{selectedEnquiry.message}</div>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-chalk-gray mb-1">DATE</div>
                      <div className="text-sm">{selectedEnquiry.date}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-mono text-chalk-gray mb-2">UPDATE STATUS</div>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value as Enquiry['status'])}
                      className="w-full bg-transparent border border-chalk-gray/30 px-3 py-2 text-sm focus:outline-none focus:border-chalk-white"
                    >
                      <option value="new" className="bg-chalk-dark">New</option>
                      <option value="contacted" className="bg-chalk-dark">Contacted</option>
                      <option value="qualified" className="bg-chalk-dark">Qualified</option>
                      <option value="proposal" className="bg-chalk-dark">Proposal Sent</option>
                      <option value="won" className="bg-chalk-dark">Won</option>
                      <option value="lost" className="bg-chalk-dark">Lost</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="block w-full px-4 py-3 border border-chalk-white text-center hover:bg-chalk-white hover:text-chalk-black transition-all font-mono text-sm"
                    >
                      SEND EMAIL
                    </a>
                    <button className="w-full px-4 py-3 border border-chalk-gray/30 text-center hover:border-chalk-white transition-all font-mono text-sm text-chalk-gray hover:text-chalk-white">
                      ADD NOTE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-chalk-black border border-chalk-gray/20 p-6 text-center text-chalk-gray">
                  Select an enquiry to view details
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
