import React, { useState, useEffect, useMemo } from 'react';
import { useListings } from '../context/ListingsContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const Listings: React.FC = () => {
  const { listings, deleteListing } = useListings();
  const navigate = useNavigate();
  const [headerActionsContainer, setHeaderActionsContainer] = useState<Element | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortOption, setSortOption] = useState('Newest First');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setHeaderActionsContainer(document.getElementById('header-actions'));
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/listings/edit/${id}`);
  };

  const handleNewListing = () => {
    navigate('/listings/new');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Derived State: Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter(listing => {
        // Status Filter
        if (statusFilter !== 'All Statuses' && listing.status !== statusFilter) {
          return false;
        }
        
        // Search Query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = listing.title.toLowerCase().includes(query);
          const matchesAddress = listing.address.toLowerCase().includes(query);
          const matchesId = listing.id.toLowerCase().includes(query);
          return matchesTitle || matchesAddress || matchesId;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort Option
        switch (sortOption) {
          case 'Newest First':
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          case 'Oldest First':
            return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          case 'Price: High to Low':
            return b.price - a.price;
          case 'Price: Low to High':
            return a.price - b.price;
          default:
            return 0;
        }
      });
  }, [listings, searchQuery, statusFilter, sortOption]);

  // Calculate dynamic stats based on current listings state (not filtered)
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'Active').length;
  const inactiveListings = listings.filter(l => l.status !== 'Active').length;

  const HeaderButtons = () => (
    <>
      <button 
        onClick={toggleFilters}
        className={`hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors
          ${showFilters 
            ? 'bg-primary/10 text-primary border-primary/20' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
      >
        <span className="material-icons-round text-sm">filter_list</span>
        Filter
      </button>
      <button 
        onClick={handleNewListing}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2"
      >
        <span className="material-icons-round text-sm">add</span>
        New Listing
      </button>
    </>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Portal for Header Buttons */}
      {headerActionsContainer && createPortal(<HeaderButtons />, headerActionsContainer)}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#15202b] rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Listings</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalListings}</h3>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
            <span className="material-icons-round">home_work</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#15202b] rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Properties</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeListings}</h3>
          </div>
          <div className="h-12 w-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="material-icons-round">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#15202b] rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inactive / Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{inactiveListings}</h3>
          </div>
          <div className="h-12 w-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-icons-round">pending_actions</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white dark:bg-[#15202b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <span className="material-icons-round">search</span>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary text-sm" 
                placeholder="Search by address, title, or ID..." 
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:border-primary focus:ring-primary flex-1 md:flex-none cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Sold</option>
              </select>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:border-primary focus:ring-primary flex-1 md:flex-none cursor-pointer"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm text-slate-700 dark:text-slate-300">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                        <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{listing.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{listing.address}</div>
                        <div className="flex gap-2 mt-1.5 text-xs text-slate-400">
                          {listing.bedrooms && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">bed</span> {listing.bedrooms}</span>}
                          {listing.bathrooms && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">bathtub</span> {listing.bathrooms}</span>}
                          {listing.sqft && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">straighten</span> {listing.sqft.toLocaleString()} sqft</span>}
                          {listing.type === 'Commercial' && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">business</span> Commercial</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                    ₦{listing.price.toLocaleString()}
                    {listing.type === 'Commercial' && <span className="text-xs font-normal text-slate-500">/mo</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                      ${listing.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        listing.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        listing.status === 'Active' ? 'bg-emerald-500' : 
                        listing.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-500'
                      }`}></span>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {listing.dateAdded}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" 
                        title="Edit"
                        onClick={() => handleEdit(listing.id)}
                      >
                        <span className="material-icons-round text-lg">edit</span>
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                        title="Delete"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <span className="material-icons-round text-lg">delete_outline</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredListings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-icons-round text-4xl mb-2 text-slate-300 dark:text-slate-600">search_off</span>
                      <p>No listings found matching your criteria.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setStatusFilter('All Statuses');}}
                        className="mt-2 text-primary hover:underline text-sm"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15202b]">
          <div className="text-sm text-slate-500 dark:text-slate-400">
             Showing <span className="font-medium text-slate-900 dark:text-white">{filteredListings.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(filteredListings.length, 4)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredListings.length}</span> results
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;