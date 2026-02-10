import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_STATS, RECENT_ACTIVITY, LISTINGS, CHART_DATA } from '../constants';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              <div className={`flex items-center mt-2 text-xs font-medium rounded-full w-fit px-2 py-1 ${stat.trendDirection === 'up' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                <span className="material-icons-round text-xs mr-1">{stat.trendDirection === 'up' ? 'trending_up' : 'trending_down'}</span>
                {stat.trend}
              </div>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bgClass} ${stat.colorClass}`}>
              <span className="material-icons-round text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Leads Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lead acquisition trends over the last 30 days</p>
            </div>
            <select className="text-sm border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === CHART_DATA.length - 1 ? '#137fec' : '#137fec66'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary hover:text-blue-600 font-medium">View All</button>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="relative flex gap-4">
                <div className={`h-8 w-8 rounded-full border-2 border-white dark:border-[#15202b] flex items-center justify-center shrink-0 z-10 ${activity.bgClass}`}>
                  <span className={`material-icons-round text-sm ${activity.colorClass}`}>{activity.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{activity.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <a href="#" className="block w-full py-2 text-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              View Full Activity Log
            </a>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Properties added in the last 7 days</p>
          </div>
          <Link to="/listings" className="text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
            Manage Listings
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {LISTINGS.slice(0, 2).map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={listing.image} alt="Property" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{listing.title}</p>
                        <p className="text-xs">ID: #{listing.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{listing.address.split(',')[1] || 'USA'}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">₦{listing.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${listing.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        listing.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-icons-round text-base">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;