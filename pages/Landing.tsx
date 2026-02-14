import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LISTINGS } from '../constants';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] font-sans text-slate-900 dark:text-white selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${scrolled ? 'bg-primary' : 'bg-white'}`}>
                <span className={`material-icons-round text-xl ${scrolled ? 'text-white' : 'text-primary'}`}>apartment</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>LUMINA<span className="font-light opacity-80">ESTATE</span></span>
          </div>
          
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/90'}`}>
            <Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
            <Link to="/properties" className="hover:text-primary dark:hover:text-white transition-colors">Properties</Link>
            <a href="#about" className="hover:text-primary dark:hover:text-white transition-colors">About Us</a>
            <a href="#contact" className="hover:text-primary dark:hover:text-white transition-colors">Contact Us</a>
          </div>

          <div className="flex items-center gap-4">
             {user ? (
                 <Link to="/dashboard" className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${scrolled ? 'bg-primary text-white hover:bg-blue-600' : 'bg-white text-primary hover:bg-white/90'}`}>
                    Dashboard
                 </Link>
             ) : (
                 <Link to="/login" className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-white/90'}`}>
                    Sign In
                 </Link>
             )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-27b5c6b33cad?q=80&w=2674&auto=format&fit=crop" 
              alt="Modern Luxury Home" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
         </div>

         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full mt-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
               Find a Home Where<br/>Your Story Begins
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
               Discover curated listings in your favorite neighborhoods with the most trusted real estate experts by your side.
            </p>

            {/* Search Widget */}
            <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 animate-[fadeInUp_0.5s_ease-out]">
                <div className="flex-1 relative border-b md:border-b-0 md:border-r border-slate-200">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-icons-round">location_on</span>
                    </span>
                    <input 
                        type="text" 
                        placeholder="City, Neighborhood, or ZIP" 
                        className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-500"
                    />
                </div>
                <div className="w-full md:w-48 relative border-b md:border-b-0 md:border-r border-slate-200">
                     <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-icons-round">home</span>
                    </span>
                    <select className="w-full pl-10 pr-8 py-3 bg-transparent border-none focus:ring-0 text-slate-900 cursor-pointer">
                        <option>All Types</option>
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                    </select>
                </div>
                <div className="w-full md:w-48 relative">
                     <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-icons-round">attach_money</span>
                    </span>
                    <select className="w-full pl-10 pr-8 py-3 bg-transparent border-none focus:ring-0 text-slate-900 cursor-pointer">
                        <option>Price Range</option>
                        <option>$100k - $500k</option>
                        <option>$500k - $1M</option>
                        <option>$1M+</option>
                    </select>
                </div>
                <button className="bg-primary hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    <span className="material-icons-round">search</span>
                    Search Homes
                </button>
            </div>
         </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">Trusted by Industry Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-600 dark:text-slate-400"><span className="material-icons-round">business</span> Forbes</div>
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-600 dark:text-slate-400"><span className="material-icons-round">tech</span> TechCrunch</div>
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-600 dark:text-slate-400"><span className="material-icons-round">article</span> Business Insider</div>
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-600 dark:text-slate-400"><span className="material-icons-round">real_estate_agent</span> Realtor</div>
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-600 dark:text-slate-400"><span className="material-icons-round">gavel</span> Sotheby's</div>
              </div>
          </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-slate-50 dark:bg-[#0b1120]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Us</h2>
                  <p className="text-slate-600 dark:text-slate-400">We're not just finding you a house; we're helping you discover the foundation for your future memories.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white dark:bg-[#15202b] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mb-6">
                          <span className="material-icons-round text-2xl">verified</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Expert Guidance</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Our agents are local experts with deep knowledge of market trends, ensuring you make informed decisions every step of the way.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white dark:bg-[#15202b] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
                      <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mb-6 relative z-10">
                          <span className="material-icons-round text-2xl">diamond</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Exclusive Listings</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm relative z-10">Gain access to off-market properties and premium listings that you won't find on standard search engines.</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white dark:bg-[#15202b] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                          <span className="material-icons-round text-2xl">handshake</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Seamless Experience</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">From the first search to handing over the keys, our digital-first process removes friction and stress from the transaction.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Handpicked Properties */}
      <section id="properties" className="py-24 bg-white dark:bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Handpicked for You</h2>
                    <p className="text-slate-600 dark:text-slate-400">Explore the latest premium additions to our portfolio.</p>
                  </div>
                  <Link to="/properties" className="flex items-center gap-1 text-slate-900 dark:text-white font-semibold hover:text-primary transition-colors group">
                      View All Properties 
                      <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {LISTINGS.slice(0, 3).map((listing, index) => (
                      <div key={listing.id} className="group bg-white dark:bg-[#15202b] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                          <div className="relative h-64 overflow-hidden">
                              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-4 left-4">
                                  <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
                                      {index === 0 ? 'Featured' : index === 1 ? 'For Sale' : 'New'}
                                  </span>
                              </div>
                              <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-full flex items-center justify-center transition-colors">
                                  <span className="material-icons-round text-lg">favorite</span>
                              </button>
                          </div>
                          <div className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-2">{listing.title}</h3>
                                  <p className="text-primary font-bold whitespace-nowrap">₦{listing.price.toLocaleString()}</p>
                              </div>
                              <div className="flex items-start gap-1 text-slate-500 dark:text-slate-400 text-sm mb-6 min-h-[40px]">
                                  <span className="material-icons-round text-base mt-0.5">location_on</span>
                                  <span className="line-clamp-2">{listing.address}</span>
                              </div>
                              
                              <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800 mb-4">
                                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                      <span className="material-icons-round text-slate-400">bed</span>
                                      <span className="font-medium">{listing.bedrooms || 3} Beds</span>
                                  </div>
                                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                      <span className="material-icons-round text-slate-400">bathtub</span>
                                      <span className="font-medium">{listing.bathrooms || 2} Baths</span>
                                  </div>
                                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                      <span className="material-icons-round text-slate-400">straighten</span>
                                      <span className="font-medium">{listing.sqft?.toLocaleString() || 2400} sqft</span>
                                  </div>
                              </div>

                              <Link to={`/properties/${listing.id}`} className="block w-full py-3 text-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                  View Details
                              </Link>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-slate-50 dark:bg-[#0b1120]">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="material-icons-round text-6xl text-primary/20 mb-6">format_quote</span>
              <h3 className="text-2xl md:text-3xl font-medium italic text-slate-800 dark:text-slate-200 mb-10 leading-relaxed">
                  "We had been looking for a home for over a year with no luck. The team at Lumina understood exactly what we needed and found us an off-market gem within two weeks. Absolutely effortless."
              </h3>
              
              <div className="flex flex-col items-center">
                  <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" 
                        alt="Sarah Jenkins" 
                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white dark:border-slate-800">
                          <span className="material-icons-round text-xs p-0.5">star</span>
                      </div>
                  </div>
                  <div className="mt-4">
                      <p className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Homeowner in Austin, TX</p>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to find your dream home?</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                  Join 50,000+ happy homeowners today and start your journey with us.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/properties" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-base shadow-lg shadow-primary/30">
                      Explore All Listings
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold rounded-lg transition-colors text-base">
                      Contact an Agent
                  </Link>
              </div>
          </div>
      </section>

      {/* Main Footer */}
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

export default Landing;