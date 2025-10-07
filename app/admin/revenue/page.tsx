'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const monthlyRevenue = [
  { month: 'Jan', revenue: 42000, expenses: 18000, profit: 24000 },
  { month: 'Feb', revenue: 38000, expenses: 17500, profit: 20500 },
  { month: 'Mar', revenue: 51000, expenses: 19000, profit: 32000 },
  { month: 'Apr', revenue: 47000, expenses: 18500, profit: 28500 },
  { month: 'May', revenue: 55000, expenses: 20000, profit: 35000 },
  { month: 'Jun', revenue: 62000, expenses: 21000, profit: 41000 },
  { month: 'Jul', revenue: 58000, expenses: 19500, profit: 38500 },
  { month: 'Aug', revenue: 67000, expenses: 22000, profit: 45000 },
  { month: 'Sep', revenue: 71000, expenses: 23000, profit: 48000 },
  { month: 'Oct', revenue: 45200, expenses: 18000, profit: 27200 },
];

const recentTransactions = [
  { id: 1, client: 'NeuroTech Labs', project: 'AI Platform Development', amount: 25000, date: '2025-10-05', status: 'paid' },
  { id: 2, client: 'GreenVest', project: 'Mobile App Design', amount: 15000, date: '2025-10-03', status: 'paid' },
  { id: 3, client: 'Environmental NGO', project: 'Climate Dashboard', amount: 18000, date: '2025-10-01', status: 'pending' },
  { id: 4, client: 'Artisan Collective', project: 'E-Commerce Platform', amount: 32000, date: '2025-09-28', status: 'overdue' },
  { id: 5, client: 'Mindful Tech', project: 'Mental Health App', amount: 12000, date: '2025-09-25', status: 'paid' },
];

export default function RevenuePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgMonthlyRevenue = totalRevenue / monthlyRevenue.length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-chalk-dark">
      <AdminSidebar />
      
      <div className="flex-1">
        <AdminHeader title="Revenue & Finance" />
        
        <main className="p-8">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">TOTAL REVENUE (YTD)</div>
              <div className="text-3xl font-bold mb-1">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-400">+18% vs last year</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">TOTAL EXPENSES (YTD)</div>
              <div className="text-3xl font-bold mb-1">${totalExpenses.toLocaleString()}</div>
              <div className="text-xs text-yellow-400">+12% vs last year</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">NET PROFIT (YTD)</div>
              <div className="text-3xl font-bold mb-1">${totalProfit.toLocaleString()}</div>
              <div className="text-xs text-green-400">+24% vs last year</div>
            </div>

            <div className="bg-chalk-black border border-chalk-gray/20 p-6">
              <div className="text-sm text-chalk-gray mb-2">AVG MONTHLY REVENUE</div>
              <div className="text-3xl font-bold mb-1">${Math.round(avgMonthlyRevenue).toLocaleString()}</div>
              <div className="text-xs text-chalk-gray">Last 10 months</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-chalk-black border border-chalk-gray/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Revenue Trends</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`px-4 py-2 text-sm font-mono border transition-colors ${
                    selectedPeriod === 'monthly'
                      ? 'border-chalk-white bg-chalk-white text-chalk-black'
                      : 'border-chalk-gray/30 text-chalk-gray hover:border-chalk-white'
                  }`}
                >
                  MONTHLY
                </button>
                <button
                  onClick={() => setSelectedPeriod('quarterly')}
                  className={`px-4 py-2 text-sm font-mono border transition-colors ${
                    selectedPeriod === 'quarterly'
                      ? 'border-chalk-white bg-chalk-white text-chalk-black'
                      : 'border-chalk-gray/30 text-chalk-gray hover:border-chalk-white'
                  }`}
                >
                  QUARTERLY
                </button>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {monthlyRevenue.map((month) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
                const revenueWidth = (month.revenue / maxRevenue) * 100;
                const expenseWidth = (month.expenses / maxRevenue) * 100;
                const profitWidth = (month.profit / maxRevenue) * 100;

                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono w-12">{month.month}</span>
                      <div className="flex-1 mx-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-6 bg-chalk-gray/10 relative overflow-hidden">
                            <div
                              className="h-full bg-green-400/30 border-r-2 border-green-400 transition-all duration-500"
                              style={{ width: `${revenueWidth}%` }}
                            />
                          </div>
                          <span className="w-20 text-right text-chalk-gray">${(month.revenue / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400/30 border border-green-400"></div>
                <span className="text-chalk-gray">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400/30 border border-red-400"></div>
                <span className="text-chalk-gray">Expenses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400/30 border border-blue-400"></div>
                <span className="text-chalk-gray">Profit</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-chalk-black border border-chalk-gray/20">
            <div className="p-6 border-b border-chalk-gray/20 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <a href="/admin/invoices" className="text-sm text-chalk-gray hover:text-chalk-white">
                View All Invoices →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-chalk-gray/20">
                  <tr className="text-left">
                    <th className="p-4 text-xs font-mono text-chalk-gray">CLIENT</th>
                    <th className="p-4 text-xs font-mono text-chalk-gray">PROJECT</th>
                    <th className="p-4 text-xs font-mono text-chalk-gray">AMOUNT</th>
                    <th className="p-4 text-xs font-mono text-chalk-gray">DATE</th>
                    <th className="p-4 text-xs font-mono text-chalk-gray">STATUS</th>
                    <th className="p-4 text-xs font-mono text-chalk-gray">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chalk-gray/20">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-chalk-white/5 transition-colors">
                      <td className="p-4 font-medium">{transaction.client}</td>
                      <td className="p-4 text-chalk-gray">{transaction.project}</td>
                      <td className="p-4 font-bold">${transaction.amount.toLocaleString()}</td>
                      <td className="p-4 text-sm text-chalk-gray">{transaction.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-mono border ${
                          transaction.status === 'paid' ? 'border-green-400 text-green-400' :
                          transaction.status === 'pending' ? 'border-yellow-400 text-yellow-400' :
                          'border-red-400 text-red-400'
                        }`}>
                          {transaction.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-chalk-gray hover:text-chalk-white">
                          View Invoice →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
