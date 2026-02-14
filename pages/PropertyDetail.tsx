import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { Listing } from '../types';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getListing } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'inquire' | 'tour'>('inquire');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getListing(id);
      if (found) {
        setListing(found);
      } else {
        // Fallback or 404 handling could go here
        // For now, let's just stay on page or redirect
        // navigate('/properties');
      }
    }
  }, [id, getListing]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ensure we have a set of images for the grid
  const displayImages = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.image, listing.image, listing.image, listing.image, listing.image];
  
  // Fill up to 5 images if needed for the grid layout
  while (displayImages.length < 5) {
      displayImages.push(listing.image);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans text-slate-900 dark:text-white">
      
      {/* Navbar (Reused from Landing/Properties for consistency) */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-icons-round text-white text-xl">apartment</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LUMINA<span className="font-light opacity-80">ESTATE</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/properties" className="text-primary font-bold">Properties</Link>
            <Link to="/#about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/#contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>

          <div className="flex items-center gap-4">
             {user ? (
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                  <img 
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop"} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                    <Link to="/dashboard" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hover:text-primary transition-colors">View Dashboard</Link>
                  </div>
                </div>
             ) : (
                <Link to="/login" className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
                    Sign In
                </Link>
             )}
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
            <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-medium truncate">{listing.title}</span>
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative">
            {/* Main Image */}
            <div className="md:col-span-2 md:row-span-2 h-full">
                <img src={displayImages[0]} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
                
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide shadow-sm z-10">
                    {listing.type}
                </div>
            </div>
            
            {/* Side Images */}
            <div className="hidden md:block h-full">
                <img src={displayImages[1]} alt="Interior 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="hidden md:block h-full relative">
                 <img src={displayImages[2]} alt="Interior 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="hidden md:block h-full">
                 <img src={displayImages[3]} alt="Interior 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="hidden md:block h-full relative group cursor-pointer">
                 <img src={displayImages[4]} alt="Interior 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <button className="flex items-center gap-2 text-white font-bold border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white hover:text-slate-900 transition-all">
                        <span className="material-icons-round text-sm">grid_view</span>
                        Show all photos
                    </button>
                 </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                  
                  {/* Header Info */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{listing.title}</h1>
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <span className="material-icons-round text-primary">location_on</span>
                              <span>{listing.address}</span>
                          </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <h2 className="text-3xl font-bold text-primary">₦{listing.price.toLocaleString()}</h2>
                         <span className="text-sm text-slate-500 dark:text-slate-400">{listing.type === 'Commercial' ? '/month' : 'listing price'}</span>
                      </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-[#15202b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                              <span className="material-icons-round">bed</span>
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Bedrooms</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">{listing.bedrooms || '-'}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                              <span className="material-icons-round">bathtub</span>
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Bathrooms</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">{listing.bathrooms || '-'}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                              <span className="material-icons-round">straighten</span>
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Area</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">{listing.sqft?.toLocaleString() || '-'} <span className="text-xs font-normal text-slate-500">sqft</span></p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                              <span className="material-icons-round">calendar_today</span>
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Built</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">2021</p>
                          </div>
                      </div>
                  </div>

                  {/* Description */}
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Description</h3>
                      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                          <p>{listing.description || "Experience luxury living in the heart of the city. This stunning property offers a seamless blend of modern architecture and natural beauty. Featuring spacious living areas, a state-of-the-art kitchen, and floor-to-ceiling windows that provide breathtaking views."}</p>
                          <p className="mt-4">The outdoor area is perfect for entertaining, with a private pool, lush gardens, and a covered patio. Located in a prestigious district, you are just minutes away from top-tier shopping, dining, and entertainment venues. Ideal for families looking for comfort, style, and convenience.</p>
                      </div>
                  </div>

                  {/* Amenities */}
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                          {(listing.amenities && listing.amenities.length > 0 ? listing.amenities : ['Free WiFi', 'Swimming Pool', 'Private Gym', 'Air Conditioning', 'Garage Parking', 'Patio', '24/7 Security', 'Laundry Room']).map((amenity, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                  <span className="material-icons-round text-primary text-xl">check_circle_outline</span>
                                  <span>{amenity}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Location Map Placeholder */}
                  <div>
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location</h3>
                          <a href="#" className="text-primary text-sm font-medium hover:underline">View on Google Maps</a>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-64 w-full flex flex-col items-center justify-center relative overflow-hidden group">
                          {/* Mock Map Background */}
                          <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center grayscale"></div>
                          <span className="material-icons-round text-4xl text-slate-400 dark:text-slate-600 mb-2">map</span>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Interactive Map Unavailable in Preview</p>
                          
                          <div className="absolute bottom-4 left-4 right-4 flex justify-around text-xs text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-[#15202b]/80 backdrop-blur-sm p-3 rounded-lg">
                              <div className="flex items-center gap-1">
                                  <span className="material-icons-round text-sm">school</span>
                                  2.5 km to School
                              </div>
                              <div className="flex items-center gap-1">
                                  <span className="material-icons-round text-sm">local_hospital</span>
                                  1.2 km to Hospital
                              </div>
                              <div className="flex items-center gap-1">
                                  <span className="material-icons-round text-sm">train</span>
                                  0.4 km to Station
                              </div>
                          </div>
                      </div>
                  </div>

              </div>

              {/* Right Column: Sticky Sidebar */}
              <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                      
                      {/* Booking Card */}
                      <div className="bg-white dark:bg-[#15202b] rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                              <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                              <div className="flex items-end gap-1">
                                  <span className="text-3xl font-bold text-primary">₦{listing.price.toLocaleString()}</span>
                                  {listing.type === 'Commercial' && <span className="text-slate-500 dark:text-slate-400 mb-1">/month</span>}
                              </div>
                          </div>
                          
                          <div className="p-6">
                              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
                                  <button 
                                    onClick={() => setActiveTab('inquire')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'inquire' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                  >
                                      Inquire Now
                                  </button>
                                  <button 
                                    onClick={() => setActiveTab('tour')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'tour' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                  >
                                      Schedule Tour
                                  </button>
                              </div>

                              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
                                      <input type="text" placeholder="John Doe" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                                      <input type="email" placeholder="john@example.com" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Message</label>
                                      <textarea rows={3} placeholder="I'm interested in this property..." className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary"></textarea>
                                  </div>
                                  <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors">
                                      Send Request
                                  </button>
                              </form>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center gap-4">
                              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" alt="Agent" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Listing Agent</p>
                                  <a href="#" className="text-xs text-primary hover:underline">View Profile</a>
                              </div>
                              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                  <span className="material-icons-round">chat_bubble_outline</span>
                              </button>
                          </div>
                      </div>

                      {/* Safe Booking Tip */}
                      <div className="bg-[#1e293b] rounded-xl p-4 flex gap-3 shadow-lg">
                          <div className="text-primary mt-0.5">
                              <span className="material-icons-round">shield</span>
                          </div>
                          <div>
                              <p className="text-sm font-bold text-white">Safe Booking Tip</p>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Never transfer money before viewing the property in person.</p>
                          </div>
                      </div>

                  </div>
              </div>

          </div>
      </div>
      
      {/* Footer Reuse */}
      <footer className="bg-[#050911] text-slate-400 pt-16 pb-8 border-t border-white/5 mt-20">
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
                  </div>
                  <div>
                      <h4 className="font-bold text-white mb-6">Discover</h4>
                      <ul className="space-y-3 text-sm">
                          <li><Link to="/properties" className="hover:text-primary transition-colors">Buy a Home</Link></li>
                          <li><Link to="/properties" className="hover:text-primary transition-colors">Rent a Home</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-white mb-6">Company</h4>
                      <ul className="space-y-3 text-sm">
                          <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                          <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                          <input type="email" placeholder="Your email address" className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border-none text-white placeholder-slate-500 focus:ring-1 focus:ring-primary" />
                          <button className="w-full py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">Subscribe</button>
                      </form>
                  </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs">
                  <p>&copy; {new Date().getFullYear()} Lumina Estate. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;