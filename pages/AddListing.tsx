import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useListings } from '../context/ListingsContext';
import { Listing } from '../types';

const AddListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListing, addListing, updateListing } = useListings();
  const [headerActionsContainer, setHeaderActionsContainer] = useState<Element | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Listing>>({
    title: '',
    type: 'Apartment',
    status: 'Active',
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    price: 0,
    sqft: 0,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzejqTwJ9uRVxU57STMEiXh4K7JLbsEYelAIvoOIPVGiAHXcms9R5htKpitsoNUXvb4e9owpbl66dVb-AxAJiU9k1NxHleUnY1UoEPjbowev88yHd1neC_tYsUQ7GkxkSvJftxG0-sxgvvsTUqBDFN94EiXSTypZb7OAowEqR-ulA3r0bcCBQErTo7knIjz1pSonwfKFShRM2Anl9tmSYpoFH7BzpUYrI2GzuwwVB3nd2R0hFxXrM2JcZAne81Y-ylrSmMzDYJQ'
  });

  useEffect(() => {
    // Find portal target
    setHeaderActionsContainer(document.getElementById('header-actions'));

    // If editing, load data
    if (id) {
      const listing = getListing(id);
      if (listing) {
        setFormData(listing);
      } else {
        // Handle not found
        navigate('/listings');
      }
    }
  }, [id, getListing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.title || !formData.price || !formData.address) {
      alert('Please fill in required fields: Title, Price, Address');
      return;
    }

    if (id) {
      updateListing(id, formData);
    } else {
      addListing(formData as any);
    }
    navigate('/listings');
  };

  const allAmenities = ['Air Conditioning', 'Swimming Pool', 'Central Heating', 'Laundry Room', 'Gym', 'Alarm', 'Window Covering', 'WiFi', 'TV Cable', 'Dryer', 'Outdoor Shower', 'Refrigerator'];

  const HeaderButtons = () => (
    <>
       <span className="text-xs text-slate-500 hidden sm:block">{id ? 'Editing...' : 'Unsaved Changes'}</span>
       <button 
         onClick={() => navigate('/listings')}
         className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
       >
         Cancel
       </button>
       <button 
         onClick={handleSubmit}
         className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2"
       >
         <span className="material-icons-round text-sm">publish</span>
         {id ? 'Update Listing' : 'Publish Listing'}
       </button>
    </>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 pb-24">
      {/* Portal for Header Actions */}
      {headerActionsContainer && createPortal(<HeaderButtons />, headerActionsContainer)}

      {/* Basic Info */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
            <span className="material-icons-round">description</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Essential details about the property listing.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Sunset Villa with Pool" 
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Commercial</option>
              <option>Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Listing Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Sold</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
               <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                  <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-icons-round text-sm">format_bold</span></button>
                  <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-icons-round text-sm">format_italic</span></button>
                  <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-icons-round text-sm">format_list_bulleted</span></button>
               </div>
               <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5} 
                  placeholder="Describe the key features and selling points..." 
                  className="w-full border-none p-4 text-slate-900 dark:text-white focus:ring-0 bg-transparent resize-y"
               ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
               <span className="material-icons-round">place</span>
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Location Details</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400">Where is this property located?</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                  <div className="relative">
                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <span className="material-icons-round text-lg">search</span>
                     </span>
                     <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
                        placeholder="Search address or enter manually" 
                     />
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zip Code</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
                </div>
            </div>
         </div>
      </div>

      {/* Property Specs */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
               <span className="material-icons-round">straighten</span>
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Property Specs</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400">Measurements and room counts.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="sm:col-span-2">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary font-mono" />
               </div>
            </div>
            <div className="sm:col-span-2">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Size (Sq Ft)</label>
               <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bedrooms</label>
               <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                  <button onClick={() => setFormData(p => ({...p, bedrooms: Math.max(0, (p.bedrooms || 0) - 1)}))} className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-lg transition-colors border-r border-slate-200 dark:border-slate-700">-</button>
                  <input type="text" value={formData.bedrooms} readOnly className="w-full text-center border-none focus:ring-0 p-2 text-slate-900 dark:text-white font-medium bg-transparent" />
                  <button onClick={() => setFormData(p => ({...p, bedrooms: (p.bedrooms || 0) + 1}))} className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r-lg transition-colors border-l border-slate-200 dark:border-slate-700">+</button>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bathrooms</label>
               <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                  <button onClick={() => setFormData(p => ({...p, bathrooms: Math.max(0, (p.bathrooms || 0) - 1)}))} className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-lg transition-colors border-r border-slate-200 dark:border-slate-700">-</button>
                  <input type="text" value={formData.bathrooms} readOnly className="w-full text-center border-none focus:ring-0 p-2 text-slate-900 dark:text-white font-medium bg-transparent" />
                  <button onClick={() => setFormData(p => ({...p, bathrooms: (p.bathrooms || 0) + 1}))} className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r-lg transition-colors border-l border-slate-200 dark:border-slate-700">+</button>
               </div>
            </div>
         </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
               <span className="material-icons-round">check_circle_outline</span>
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Amenities</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400">Select all features available.</p>
            </div>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allAmenities.map((amenity) => (
               <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary" 
                    checked={(formData.amenities || []).includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{amenity}</span>
               </label>
            ))}
         </div>
      </div>

      {/* Media */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
               <span className="material-icons-round">photo_library</span>
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Media</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400">Upload high-quality photos and videos.</p>
            </div>
         </div>
         <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
               <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {/* Current Main Image */}
               {formData.image && (
                 <div className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                       <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded w-max">COVER</span>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AddListing;