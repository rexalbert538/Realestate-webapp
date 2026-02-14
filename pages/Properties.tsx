import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { Listing } from '../types';

const Properties: React.FC = () => {
  const { user } = useAuth();
  const { listings } = useListings();
  const [activeSort, setActiveSort] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());

  // Filter Inputs (Form State)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Property Type');
  const [priceFilter, setPriceFilter] = useState('Price Range');
  const [locationFilter, setLocationFilter] = useState('Location');

  // Applied Filters (Active Search State)
  const [appliedFilters, setAppliedFilters] = useState({
      search: '',
      type: 'Property Type',
      price: 'Price Range',
      location: 'Location'
  });

  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setActiveDropdown(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLike = (id: string) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSearch = () => {
      setAppliedFilters({
          search: searchQuery,
          type: typeFilter,
          price: priceFilter,
          location: locationFilter
      });
      setCurrentPage(1);
      setActiveDropdown(null);
  };

  const clearFilter = (key: keyof typeof appliedFilters) => {
      const defaults = {
          search: '',
          type: 'Property Type',
          price: 'Price Range',
          location: 'Location'
      };

      // Reset the specific input
      if (key === 'search') setSearchQuery('');
      if (key === 'type') setTypeFilter('Property Type');
      if (key === 'price') setPriceFilter('Price Range');
      if (key === 'location') setLocationFilter('Location');

      // Update applied filters immediately
      setAppliedFilters(prev => ({
          ...prev,
          [key]: defaults[key]
      }));
  };

  const clearAllFilters = () => {
      setSearchQuery('');
      setTypeFilter('Property Type');
      setPriceFilter('Price Range');
      setLocationFilter('Location');
      setAppliedFilters({
          search: '',
          type: 'Property Type',
          price: 'Price Range',
          location: 'Location'
      });
  };

  // Helper to extract city from listing
  const getCity = (listing: Listing) => {
      if (listing.city) return listing.city;
      const parts = listing.address.split(',');
      if (parts.length > 1) {
          return parts[parts.length - 1].trim();
      }
      return 'Unknown';
  };

  // Filter & Sort Logic based on APPLIED filters
  const filteredListings = useMemo(() => {
    let result = listings;
    const { search, type, price, location } = appliedFilters;

    // Search
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(l => 
            l.title.toLowerCase().includes(query) || 
            l.address.toLowerCase().includes(query) ||
            (l.city && l.city.toLowerCase().includes(query))
        );
    }

    // Type Filter
    if (type !== 'Property Type') {
        result = result.filter(l => l.type === type);
    }

    // Price Filter
    if (price !== 'Price Range') {
        if (price === 'Under ₦500k') result = result.filter(l => l.price < 500000);
        if (price === '₦500k - ₦1M') result = result.filter(l => l.price >= 500000 && l.price < 1000000);
        if (price === '₦1M+') result = result.filter(l => l.price >= 1000000);
    }

    // Location Filter
    if (location !== 'Location') {
         result = result.filter(l => getCity(l) === location);
    }

    // Sorting
    return result.sort((a, b) => {
        switch (activeSort) {
            case 'Price: Low to High': return a.price - b.price;
            case 'Price: High to Low': return b.price - a.price;
            case 'Newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            default: return 0; // Recommended (Default order)
        }
    });
  }, [listings, appliedFilters, activeSort]);

  // Pagination Logic (Mock)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const displayedListings = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Extract unique cities for filter
  const cities = Array.from(new Set(listings.map(getCity).filter(c => c && c !== 'Unknown')));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-icons-round text-white text-xl">apartment</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LUMINA<span className="font-light opacity-80">ESTATE</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/properties" className="text-primary font-bold">Properties</Link>
            <a href="/#about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/#contact" className="hover:text-primary transition-colors">Contact Us</a>
          </div>

          <div className="flex items-center gap-4">
             {user ? (
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <img 
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop"} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                    <Link to="/dashboard" className="text-xs text-slate-500 mt-0.5 hover:text-primary transition-colors">View Dashboard</Link>
                  </div>
                </div>
             ) : (
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Log in</Link>
                    <Link to="/register" className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-primary/20">
                        Get Started
                    </Link>
                </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Bar - Light Themed */}
        <div className="bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 mb-8 border border-slate-100" ref={dropdownRef}>
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <span className="material-icons-round">search</span>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by city, neighborhood, or address..." 
                className="w-full pl-12 pr-4 h-[50px] bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all text-sm"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Location Dropdown */}
              <div className="relative">
                <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                    className="w-full sm:w-44 h-[50px] flex items-center justify-between px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm hover:border-primary/50 hover:bg-white transition-all"
                >
                    <div className="flex items-center gap-2 truncate">
                        <span className="material-icons-round text-slate-400 text-lg">location_on</span>
                        <span className="truncate">{locationFilter === 'Location' ? 'Location' : locationFilter}</span>
                    </div>
                    <span className="material-icons-round text-slate-400 ml-2">expand_more</span>
                </button>
                {activeDropdown === 'location' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto animate-[fadeIn_0.1s_ease-out]">
                        <button 
                            onClick={() => { setLocationFilter('Location'); setActiveDropdown(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            Any Location
                        </button>
                        {cities.map(city => (
                            <button 
                                key={city}
                                onClick={() => { setLocationFilter(city); setActiveDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              {/* Property Type Dropdown */}
              <div className="relative">
                <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                    className="w-full sm:w-48 h-[50px] flex items-center justify-between px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm hover:border-primary/50 hover:bg-white transition-all"
                >
                    <div className="flex items-center gap-2 truncate">
                        <span className="material-icons-round text-slate-400 text-lg">apartment</span>
                        <span className="truncate">{typeFilter}</span>
                    </div>
                    <span className="material-icons-round text-slate-400 ml-2">expand_more</span>
                </button>
                {activeDropdown === 'type' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 animate-[fadeIn_0.1s_ease-out]">
                         {['Property Type', 'House', 'Apartment', 'Villa', 'Commercial', 'Land'].map(type => (
                            <button 
                                key={type}
                                onClick={() => { setTypeFilter(type); setActiveDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                {type === 'Property Type' ? 'Any Type' : type}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              {/* Price Range Dropdown */}
              <div className="relative">
                <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                    className="w-full sm:w-44 h-[50px] flex items-center justify-between px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm hover:border-primary/50 hover:bg-white transition-all"
                >
                    <div className="flex items-center gap-2 truncate">
                        <span className="font-sans font-bold text-slate-400 text-lg">₦</span>
                        <span className="truncate">{priceFilter}</span>
                    </div>
                    <span className="material-icons-round text-slate-400 ml-2">expand_more</span>
                </button>
                {activeDropdown === 'price' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 animate-[fadeIn_0.1s_ease-out]">
                        {['Price Range', 'Under ₦500k', '₦500k - ₦1M', '₦1M+'].map(price => (
                             <button 
                                key={price}
                                onClick={() => { setPriceFilter(price); setActiveDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                {price === 'Price Range' ? 'Any Price' : price}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="px-8 h-[50px] bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary/20 whitespace-nowrap flex items-center justify-center"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(appliedFilters.search || appliedFilters.type !== 'Property Type' || appliedFilters.price !== 'Price Range' || appliedFilters.location !== 'Location') && (
            <div className="flex items-center gap-3 mb-6 text-xs flex-wrap">
                <span className="text-slate-500 font-medium">Active Filters:</span>
                {appliedFilters.location !== 'Location' && (
                    <div className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                    <span>{appliedFilters.location}</span>
                    <button onClick={() => clearFilter('location')} className="hover:text-red-500"><span className="material-icons-round text-sm">close</span></button>
                    </div>
                )}
                {appliedFilters.type !== 'Property Type' && (
                    <div className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                    <span>{appliedFilters.type}</span>
                    <button onClick={() => clearFilter('type')} className="hover:text-red-500"><span className="material-icons-round text-sm">close</span></button>
                    </div>
                )}
                 {appliedFilters.price !== 'Price Range' && (
                    <div className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                    <span>{appliedFilters.price}</span>
                    <button onClick={() => clearFilter('price')} className="hover:text-red-500"><span className="material-icons-round text-sm">close</span></button>
                    </div>
                )}
                <button 
                    onClick={clearAllFilters}
                    className="text-primary hover:text-blue-700 ml-2 font-medium transition-colors"
                >
                    Clear all
                </button>
            </div>
          )}

        {/* Listings Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Listed Properties ({filteredListings.length})</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-primary transition-colors">
                {activeSort}
                <span className="material-icons-round text-lg">expand_more</span>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-2 hidden group-hover:block z-10 animate-[fadeIn_0.1s_ease-out]">
                {['Recommended', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((sort) => (
                  <button 
                    key={sort}
                    onClick={() => setActiveSort(sort)}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSort === sort ? 'text-primary bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedListings.map((property) => (
            <div key={property.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
              
              {/* Image Container */}
              <div className="relative h-60 overflow-hidden flex-shrink-0">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded text-white tracking-wide uppercase shadow-sm ${property.type === 'Villa' ? 'bg-primary' : 'bg-slate-900/80 backdrop-blur-sm'}`}>
                    {property.type}
                  </span>
                  {property.status !== 'Active' && (
                     <span className={`text-[10px] font-bold px-3 py-1.5 rounded text-white tracking-wide uppercase shadow-sm ${property.status === 'Sold' ? 'bg-red-500' : 'bg-amber-500'}`}>
                        {property.status}
                     </span>
                  )}
                </div>

                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(property.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white backdrop-blur-md flex items-center justify-center transition-colors group/btn"
                >
                  <span className={`material-icons-round text-lg transition-colors ${likedProperties.has(property.id) ? 'text-red-500' : 'text-white group-hover/btn:text-red-500'}`}>
                    {likedProperties.has(property.id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>

                {/* Image Count */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-[10px] font-medium text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                  <span className="material-icons-round text-xs">photo_camera</span>
                  {property.images ? property.images.length : 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
                
                <div className="flex items-start gap-1.5 mb-4 min-h-[40px]">
                  <span className="material-icons-round text-primary text-lg mt-0.5">location_on</span>
                  <p className="text-sm text-slate-500 leading-snug line-clamp-2">{property.address}</p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100 border-b mb-4">
                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-icons-round text-slate-400 text-sm">bed</span>
                      <span><span className="text-slate-900 font-bold">{property.bedrooms || 0}</span> Beds</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-icons-round text-slate-400 text-sm">bathtub</span>
                      <span><span className="text-slate-900 font-bold">{property.bathrooms || 0}</span> Baths</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-icons-round text-slate-400 text-sm">straighten</span>
                      <span><span className="text-slate-900 font-bold">{property.sqft?.toLocaleString() || '-'}</span> sqft</span>
                   </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xl font-bold text-primary">₦{property.price.toLocaleString()}</span>
                    {property.type === 'Commercial' && <span className="text-xs text-slate-400 ml-1">/mo</span>}
                  </div>
                  <Link 
                    to={`/properties/${property.id}`}
                    className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-center gap-2">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
                <span className="material-icons-round text-sm">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    {page}
                </button>
            ))}
            
            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
                <span className="material-icons-round text-sm">chevron_right</span>
            </button>
            </div>
        )}

        {displayedListings.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                <span className="material-icons-round text-5xl text-slate-300 mb-4">home_work</span>
                <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                <button 
                    onClick={clearAllFilters}
                    className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Clear Filters
                </button>
            </div>
        )}
      </main>

      {/* Main Footer (Matched to Landing Page) */}
      <footer id="contact" className="bg-[#050911] text-slate-400 pt-16 pb-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                  <div>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary p-1.5 rounded">
                            <span className="material-icons-round text-white text-lg">apartment</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">LUMINA<span className="font-light opacity-80">ESTATE</span></span>
                      </div>
                      <p className="text-sm leading-relaxed mb-6">
                          Redefining the real estate experience with modern technology and old-fashioned integrity.
                      </p>
                      <div className="flex gap-4">
                          <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <span className="text-xs font-bold">f</span>
                          </a>
                          <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <span className="text-xs font-bold">t</span>
                          </a>
                          <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <span className="text-xs font-bold">in</span>
                          </a>
                      </div>
                  </div>
                  
                  <div>
                      <h4 className="font-bold text-white mb-6">Discover</h4>
                      <ul className="space-y-3 text-sm">
                          <li><Link to="/properties" className="hover:text-primary transition-colors">Buy a Home</Link></li>
                          <li><Link to="/properties" className="hover:text-primary transition-colors">Rent a Home</Link></li>
                          <li><Link to="/register" className="hover:text-primary transition-colors">Sell Your Home</Link></li>
                          <li><Link to="/properties" className="hover:text-primary transition-colors">New Developments</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-white mb-6">Company</h4>
                      <ul className="space-y-3 text-sm">
                          <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                          <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                          <li><a href="#" className="hover:text-primary transition-colors">Our Agents</a></li>
                          <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                      <p className="text-sm mb-4">Get the latest market insights and exclusive listings.</p>
                      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                          <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border-none text-white placeholder-slate-500 focus:ring-1 focus:ring-primary"
                          />
                          <button className="w-full py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                              Subscribe
                          </button>
                      </form>
                  </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                  <p>&copy; {new Date().getFullYear()} Lumina Estate. All rights reserved.</p>
                  <div className="flex gap-6">
                      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Properties;