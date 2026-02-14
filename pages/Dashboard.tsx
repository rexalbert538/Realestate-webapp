import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useLeads } from '../context/LeadsContext';
import { useActivity } from '../context/ActivityContext';
import { Stat } from '../types';

const Dashboard: React.FC = () => {
  const { listings } = useListings();
  const { leads } = useLeads();
  const { activities, refreshActivities, isLoading } = useActivity();
  const [filterDays, setFilterDays] = useState(30);

  // Calculate Dynamic Stats
  const stats: Stat[] = useMemo(() => {
    // 1. Total Listings
    const totalListings = listings.length;
    
    // 2. Total Leads
    const totalLeads = leads.length;
    
    // 3. Views (Mock calculation based on listings)
    const views = totalListings * 125 + totalLeads * 45; 
    const viewsFormatted = views > 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString();

    // 4. Revenue (Sum of 'Sold' listings * 5% commission, or sum of 'Closed' leads property price)
    // Let's use 'Sold' listings for this calculation
    const soldListings = listings.filter(l => l.status === 'Sold');
    const totalSalesVolume = soldListings.reduce((sum, item) => sum + item.price, 0);
    const estimatedRevenue = totalSalesVolume * 0.05; // 5% commission
    const revenueFormatted = estimatedRevenue.toLocaleString();

    return [
      {
        label: "Total Listings",
        value: totalListings.toString(),
        trend: "+12% this month",
        trendDirection: "up",
        icon: "home_work",
        colorClass: "text-primary",
        bgClass: "bg-blue-50 dark:bg-blue-900/20"
      },
      {
        label: "Total Leads",
        value: totalLeads.toString(),
        trend: "+5% this week",
        trendDirection: "up",
        icon: "group",
        colorClass: "text-purple-600 dark:text-purple-400",
        bgClass: "bg-purple-50 dark:bg-purple-900/20"
      },
      {
        label: "Property Views",
        value: viewsFormatted,
        trend: "-2.4% vs last mo",
        trendDirection: "down",
        icon: "visibility",
        colorClass: "text-amber-600 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-900/20"
      },
      {
        label: "Revenue",
        value: revenueFormatted,
        trend: "+18% this month",
        trendDirection: "up",
        icon: "naira", // Custom flag to render Naira
        colorClass: "text-emerald-600 dark:text-emerald-400",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/20"
      }
    ];
  }, [listings, leads]);

  // Generate dynamic chart data based on leads timestamps
  const chartData = useMemo(() => {
    const now = new Date();
    // Normalize now to end of day to include all of today
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    const cutoffDate = new Date(endOfToday);
    cutoffDate.setDate(cutoffDate.getDate() - filterDays + 1); // +1 to include start day
    const cutoffTimestamp = cutoffDate.setHours(0,0,0,0);

    // Initialize map for all days in range to ensure x-axis continuity
    const dayMap = new Map<string, number>();
    const result = [];
    
    // Create skeleton for all days
    for (let d = new Date(cutoffDate); d <= endOfToday; d.setDate(d.getDate() + 1)) {
        const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dayMap.set(dayLabel, 0);
        result.push({ name: dayLabel, value: 0 }); // Keep reference order
    }

    // Populate with lead counts
    leads.forEach(lead => {
        if (lead.timestamp >= cutoffTimestamp) {
            const leadDate = new Date(lead.timestamp);
            const label = leadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dayMap.has(label)) {
                dayMap.set(label, (dayMap.get(label) || 0) + 1);
            }
        }
    });

    // Update result array values
    return result.map(item => ({
        ...item,
        value: dayMap.get(item.name) || 0
    }));
  }, [leads, filterDays]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.label === 'Revenue' && '₦'}
                {stat.value}
              </h3>
              <div className={`flex items-center mt-2 text-xs font-medium rounded-full w-fit px-2 py-1 ${stat.trendDirection === 'up' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                <span className="material-icons-round text-xs mr-1">{stat.trendDirection === 'up' ? 'trending_up' : 'trending_down'}</span>
                {stat.trend}
              </div>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bgClass} ${stat.colorClass}`}>
              {stat.icon === 'naira' ? (
                <span className="text-2xl font-sans font-bold">₦</span>
              ) : (
                <span className="material-icons-round text-2xl">{stat.icon}</span>
              )}
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Lead acquisition trends</p>
            </div>
            <select 
                value={filterDays}
                onChange={(e) => setFilterDays(Number(e.target.value))}
                className="text-sm border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="30">Last 30 Days</option>
              <option value="7">Last 7 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                    interval={filterDays > 30 ? 6 : filterDays > 7 ? 4 : 0} // Adjust label density
                />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={filterDays > 30 ? 10 : 30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#137fec' : '#137fec66'} />
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
            <Link to="/settings" className="text-sm text-primary hover:text-blue-600 font-medium">View Settings</Link>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
            {activities.length > 0 ? activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="relative flex gap-4 animate-[fadeIn_0.3s_ease-out]">
                <div className={`h-8 w-8 rounded-full border-2 border-white dark:border-[#15202b] flex items-center justify-center shrink-0 z-10 ${activity.bgClass}`}>
                  <span className={`material-icons-round text-sm ${activity.colorClass}`}>{activity.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{activity.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{activity.time}</span>
                </div>
              </div>
            )) : (
                <div className="text-center text-sm text-slate-400 py-4">No recent activity</div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
                onClick={refreshActivities}
                disabled={isLoading}
                className="w-full py-2 text-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    Refreshing...
                  </>
              ) : (
                  <>
                    <span className="material-icons-round text-sm">refresh</span>
                    Refresh Activity
                  </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Properties added recently</p>
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
              {listings.slice(0, 3).map((listing) => (
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
                  <td className="px-6 py-4">{listing.address.split(',')[1] || listing.address || 'USA'}</td>
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
                    <Link to={`/listings/edit/${listing.id}`} className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-icons-round text-base">edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No listings available. Add one to see it here.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;