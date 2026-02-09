import React, { useState } from 'react';
import { LEADS } from '../constants';

const Leads: React.FC = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(LEADS[0].id);
  const selectedLead = LEADS.find(l => l.id === selectedLeadId) || LEADS[0];

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Lead List */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-700 min-w-0 bg-white dark:bg-[#15202b] max-w-full xl:max-w-4xl">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-full max-w-sm">
            <span className="material-icons-round text-slate-400">search</span>
            <input 
                type="text" 
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full text-slate-900 dark:text-white placeholder-slate-400" 
                placeholder="Search leads..." 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <select className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 focus:border-primary focus:ring-primary">
              <option>All Statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Closed</option>
            </select>
            <select className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 focus:border-primary focus:ring-primary">
              <option>Any Source</option>
              <option>Website</option>
              <option>Zillow</option>
              <option>Referral</option>
            </select>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
               <span className="material-icons-round text-sm">filter_list</span>
            </button>
          </div>
        </div>
        
        {/* Leads Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold sticky top-0 z-10 backdrop-blur-sm">
               <tr>
                  <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">Lead Name</th>
                  <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 hidden sm:table-cell">Property</th>
                  <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Source</th>
                  <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 text-right">Date</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {LEADS.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`cursor-pointer transition-colors ${selectedLeadId === lead.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${lead.avatarColor}`}>
                        {lead.avatarText}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                        <div className="text-xs text-slate-500">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{lead.propertyInterest}</div>
                    <div className="text-xs text-slate-500">${lead.propertyPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {lead.source === 'Website' && <span className="material-icons-round text-[10px]">language</span>}
                        {lead.source === 'Zillow' && <span className="material-icons-round text-[10px]">home</span>}
                        {lead.source === 'Referral' && <span className="material-icons-round text-[10px]">person_add</span>}
                        {lead.source}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${lead.status === 'New' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        lead.status === 'Contacted' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        lead.status === 'Qualified' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                      {lead.status === 'New' && <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>}
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-500">
                    {lead.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Panel (Right Side) */}
      <div className="w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b] flex-col hidden xl:flex">
         <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl ${selectedLead.avatarColor}`}>
                     {selectedLead.avatarText}
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedLead.name}</h2>
                     <div className="flex items-center gap-2 mt-1">
                        {selectedLead.status === 'New' && (
                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              NEW LEAD
                           </span>
                        )}
                        <span className="text-xs text-slate-400">Added {selectedLead.date}</span>
                     </div>
                  </div>
               </div>
               <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <span className="material-icons-round">more_vert</span>
               </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
               <button className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  <span className="material-icons-round text-sm">email</span> Email
               </button>
               <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-icons-round text-sm">phone</span> Call
               </button>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Info</label>
                  <div className="mt-2 space-y-2">
                     <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="material-icons-round text-slate-400 text-base">mail</span>
                        {selectedLead.email}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="material-icons-round text-slate-400 text-base">phone</span>
                        {selectedLead.phone}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="material-icons-round text-slate-400 text-base">location_on</span>
                        {selectedLead.location}
                     </div>
                  </div>
               </div>
               <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interested In</label>
                  <div className="mt-2 flex gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMzejqTwJ9uRVxU57STMEiXh4K7JLbsEYelAIvoOIPVGiAHXcms9R5htKpitsoNUXvb4e9owpbl66dVb-AxAJiU9k1NxHleUnY1UoEPjbowev88yHd1neC_tYsUQ7GkxkSvJftxG0-sxgvvsTUqBDFN94EiXSTypZb7OAowEqR-ulA3r0bcCBQErTo7knIjz1pSonwfKFShRM2Anl9tmSYpoFH7BzpUYrI2GzuwwVB3nd2R0hFxXrM2JcZAne81Y-ylrSmMzDYJQ" alt="Property thumbnail" className="w-12 h-12 object-cover rounded-md" />
                     <div className="overflow-hidden">
                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedLead.propertyInterest}</div>
                        <div className="text-xs text-slate-500">${selectedLead.propertyPrice.toLocaleString()} • For Sale</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900/20">
            <div className="px-6 pt-4">
               <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700">
                  <button className="pb-2 text-sm font-medium text-primary border-b-2 border-primary">Activity</button>
                  <button className="pb-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Notes</button>
                  <button className="pb-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Files</button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((note) => (
                     <div key={note.id} className="flex gap-3">
                        <div className="mt-1 flex flex-col items-center">
                           <div className={`h-2 w-2 rounded-full ring-4 ring-white dark:ring-[#15202b] ${note.type === 'user' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                           {note.type === 'user' && <div className="h-full w-px bg-slate-200 dark:bg-slate-700 my-1"></div>}
                        </div>
                        <div className="pb-4">
                           <p className="text-xs text-slate-400 mb-1">{note.date}</p>
                           <p className="text-sm text-slate-800 dark:text-slate-200">
                              {note.text}
                           </p>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="text-center text-slate-400 text-sm py-8">No recent activity</div>
               )}
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b]">
               <div className="relative">
                  <input type="text" placeholder="Add a note..." className="w-full pl-4 pr-10 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-transparent rounded-full focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 transition-colors text-slate-900 dark:text-white" />
                  <button className="absolute right-2 top-1.5 p-1 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full">
                     <span className="material-icons-round text-lg">send</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Leads;