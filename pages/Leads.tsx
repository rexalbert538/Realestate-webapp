import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { LEADS } from '../constants';
import { Lead, Note } from '../types';

const Leads: React.FC = () => {
  // State
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [headerActionsContainer, setHeaderActionsContainer] = useState<Element | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'activity' | 'notes' | 'files'>('notes');
  const [noteInput, setNoteInput] = useState('');
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sourceFilter, setSourceFilter] = useState('Any Source');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    propertyPrice: 0,
    status: 'New',
    source: 'Website'
  });

  useEffect(() => {
    setHeaderActionsContainer(document.getElementById('header-actions'));
    // Select first lead on desktop if none selected
    if (!selectedLeadId && leads.length > 0 && window.innerWidth >= 1280) {
      setSelectedLeadId(leads[0].id);
    }
  }, []);

  // Filter Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'Any Source' || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const selectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || filteredLeads[0];
  }, [leads, selectedLeadId, filteredLeads]);

  // Actions
  const handleLeadClick = (id: string) => {
    setSelectedLeadId(id);
    setShowMobileDetail(true);
  };

  const handleBackToDesktop = () => {
    setShowMobileDetail(false);
  };

  const handleAddNote = () => {
    if (!noteInput.trim() || !selectedLead) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: noteInput,
      date: 'Just now',
      type: 'user'
    };

    setLeads(prev => prev.map(l => {
      if (l.id === selectedLead.id) {
        return { ...l, notes: [newNote, ...(l.notes || [])] };
      }
      return l;
    }));
    setNoteInput('');
  };

  const handleDeleteLead = () => {
    if (!selectedLead) return;
    if (window.confirm(`Are you sure you want to delete ${selectedLead.name}?`)) {
      setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
      if (showMobileDetail) setShowMobileDetail(false);
      setSelectedLeadId(null);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
        id: Date.now().toString(),
        name: newLeadData.name || 'New Lead',
        email: newLeadData.email || '',
        phone: newLeadData.phone || '',
        location: 'Unknown',
        propertyInterest: newLeadData.propertyInterest || 'General Inquiry',
        propertyPrice: Number(newLeadData.propertyPrice) || 0,
        status: newLeadData.status as any || 'New',
        source: newLeadData.source as any || 'Website',
        date: 'Just now',
        avatarColor: 'bg-slate-200 text-slate-600',
        avatarText: (newLeadData.name || 'NL').substring(0,2).toUpperCase(),
        notes: []
    };
    
    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);
    setSelectedLeadId(newLead.id);
    setNewLeadData({
        name: '', email: '', phone: '', propertyInterest: '', propertyPrice: 0, status: 'New', source: 'Website'
    });
  };

  const HeaderButtons = () => (
    <>
        <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
        <span className="material-icons-round">notifications</span>
        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2"
        >
        <span className="material-icons-round text-sm">add</span>
        Add Lead
        </button>
    </>
  );

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] relative">
      {/* Portal Header Actions */}
      {headerActionsContainer && createPortal(<HeaderButtons />, headerActionsContainer)}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-[fadeIn_0.2s_ease-out]">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add New Lead</h3>
                  <form onSubmit={handleCreateLead} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                          <input required type="text" value={newLeadData.name} onChange={e => setNewLeadData({...newLeadData, name: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input type="email" value={newLeadData.email} onChange={e => setNewLeadData({...newLeadData, email: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                            <input type="tel" value={newLeadData.phone} onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Interest</label>
                          <input type="text" value={newLeadData.propertyInterest} onChange={e => setNewLeadData({...newLeadData, propertyInterest: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                            <select value={newLeadData.status} onChange={e => setNewLeadData({...newLeadData, status: e.target.value as any})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Qualified</option>
                                <option>Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source</label>
                            <select value={newLeadData.source} onChange={e => setNewLeadData({...newLeadData, source: e.target.value as any})} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                <option>Website</option>
                                <option>Zillow</option>
                                <option>Referral</option>
                            </select>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6 pt-2">
                          <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                          <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 shadow-sm shadow-primary/30">Create Lead</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Lead List (Left Side) */}
      <div className={`flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b] w-full xl:w-auto xl:flex-1 xl:max-w-4xl transition-all duration-300 ${showMobileDetail ? 'hidden xl:flex' : 'flex'}`}>
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center justify-between sticky top-0 bg-white dark:bg-[#15202b] z-10">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-full max-w-sm">
            <span className="material-icons-round text-slate-400">search</span>
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full text-slate-900 dark:text-white placeholder-slate-400" 
                placeholder="Search leads..." 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 focus:border-primary focus:ring-primary cursor-pointer"
            >
              <option>All Statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Closed</option>
            </select>
            <select 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 focus:border-primary focus:ring-primary cursor-pointer"
            >
              <option>Any Source</option>
              <option>Website</option>
              <option>Zillow</option>
              <option>Referral</option>
            </select>
            <button 
                onClick={() => {setSearchQuery(''); setStatusFilter('All Statuses'); setSourceFilter('Any Source');}}
                className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="Clear Filters"
            >
               <span className="material-icons-round text-sm">filter_list_off</span>
            </button>
          </div>
        </div>
        
        {/* Leads Table */}
        <div className="flex-1 overflow-y-auto">
          {filteredLeads.length > 0 ? (
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
                {filteredLeads.map((lead) => (
                    <tr 
                    key={lead.id} 
                    onClick={() => handleLeadClick(lead.id)}
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
                        <div className="text-xs text-slate-500">₦{lead.propertyPrice.toLocaleString()}</div>
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
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <span className="material-icons-round text-4xl mb-2 opacity-30">search_off</span>
                <p>No leads found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Panel (Right Side) */}
      {/* Mobile: Full Screen Overlay / Desktop: Side Panel */}
      <div className={`w-full xl:w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b] flex-col ${showMobileDetail ? 'flex absolute inset-0 z-20' : 'hidden xl:flex'}`}>
         
         {/* Detail Header */}
         <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            {/* Mobile Back Button */}
            <div className="xl:hidden mb-4">
                <button onClick={handleBackToDesktop} className="flex items-center text-sm text-slate-500 hover:text-primary">
                    <span className="material-icons-round mr-1">arrow_back</span>
                    Back to Leads
                </button>
            </div>

            {selectedLead ? (
                <>
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
                    
                    <div className="relative group">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round">more_vert</span>
                        </button>
                        {/* Simple Dropdown for Demo */}
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 hidden group-hover:block z-30">
                            <button 
                                onClick={handleDeleteLead}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                            >
                                Delete Lead
                            </button>
                        </div>
                    </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <a 
                            href={`mailto:${selectedLead.email}`}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            <span className="material-icons-round text-sm">email</span> Email Lead
                        </a>
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
                                {selectedLead.phone || 'No phone number'}
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
                            <div className="w-12 h-12 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400">
                                <span className="material-icons-round">home</span>
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedLead.propertyInterest}</div>
                                <div className="text-xs text-slate-500">₦{selectedLead.propertyPrice.toLocaleString()} • For Sale</div>
                            </div>
                        </div>
                    </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-slate-400">Select a lead to view details</div>
            )}
         </div>
         
         {selectedLead && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900/20">
                <div className="px-6 pt-4">
                <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'activity' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        Activity
                    </button>
                    <button 
                        onClick={() => setActiveTab('notes')}
                        className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        Notes
                    </button>
                    <button 
                        onClick={() => setActiveTab('files')}
                        className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'files' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        Files
                    </button>
                </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   {activeTab === 'notes' && (
                        <>
                             {selectedLead.notes && selectedLead.notes.length > 0 ? (
                                selectedLead.notes.map((note) => (
                                    <div key={note.id} className="flex gap-3 animate-[fadeIn_0.2s_ease-out]">
                                        <div className="mt-1 flex flex-col items-center">
                                        <div className={`h-2 w-2 rounded-full ring-4 ring-white dark:ring-[#15202b] ${note.type === 'user' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <div className="h-full w-px bg-slate-200 dark:bg-slate-700 my-1"></div>
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
                                <div className="text-center text-slate-400 text-sm py-8 italic">No notes added yet.</div>
                            )}
                        </>
                   )}
                   
                   {activeTab === 'activity' && (
                       <div className="text-center text-slate-400 text-sm py-8 italic">Activity log coming soon.</div>
                   )}
                   
                   {activeTab === 'files' && (
                       <div className="text-center text-slate-400 text-sm py-8 italic">No files attached.</div>
                   )}
                </div>
                
                {activeTab === 'notes' && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b]">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                placeholder="Add a note..." 
                                className="w-full pl-4 pr-10 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-transparent rounded-full focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 transition-colors text-slate-900 dark:text-white" 
                            />
                            <button 
                                onClick={handleAddNote}
                                className="absolute right-2 top-1.5 p-1 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                            >
                                <span className="material-icons-round text-lg">send</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
         )}
      </div>
    </div>
  );
};

export default Leads;