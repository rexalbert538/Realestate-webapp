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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    image: '',
    images: [] 
  });

  // Validation & UI State
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Find portal target
    setHeaderActionsContainer(document.getElementById('header-actions'));

    // If editing, load data
    if (id) {
      const listing = getListing(id);
      if (listing) {
        setFormData({
            ...listing,
            images: listing.images || (listing.image ? [listing.image] : [])
        });
      } else {
        // Handle not found
        navigate('/listings');
      }
    } else {
        // Default image for new listings (optional)
        const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzejqTwJ9uRVxU57STMEiXh4K7JLbsEYelAIvoOIPVGiAHXcms9R5htKpitsoNUXvb4e9owpbl66dVb-AxAJiU9k1NxHleUnY1UoEPjbowev88yHd1neC_tYsUQ7GkxkSvJftxG0-sxgvvsTUqBDFN94EiXSTypZb7OAowEqR-ulA3r0bcCBQErTo7knIjz1pSonwfKFShRM2Anl9tmSYpoFH7BzpUYrI2GzuwwVB3nd2R0hFxXrM2JcZAne81Y-ylrSmMzDYJQ';
        setFormData(prev => ({
            ...prev,
            image: defaultImg,
            images: [defaultImg]
        }));
    }
  }, [id, getListing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
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

  // Image Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB

    Array.from(files).forEach(file => {
      if (file.size > maxSizeBytes) {
        alert(`File "${file.name}" is too large. Maximum size is 3MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => {
           const currentImages = prev.images || [];
           const updatedImages = [...currentImages, result];
           // If no cover image exists, set the first one uploaded
           const updatedCover = prev.image || result;
           return { ...prev, images: updatedImages, image: updatedCover };
        });
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const url = e.currentTarget.value;
          if (url) {
              setFormData(prev => ({
                  ...prev,
                  images: [...(prev.images || []), url],
                  image: prev.image || url
              }));
              e.currentTarget.value = '';
          }
      }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => {
      const currentImages = prev.images || [];
      const imageToRemove = currentImages[indexToRemove];
      const newImages = currentImages.filter((_, idx) => idx !== indexToRemove);
      
      // If we removed the main image, reset it to the first available or empty
      let newMainImage = prev.image;
      if (prev.image === imageToRemove) {
          newMainImage = newImages.length > 0 ? newImages[0] : '';
      }

      return { ...prev, images: newImages, image: newMainImage };
    });
  };

  const setAsCover = (imgUrl: string) => {
      setFormData(prev => ({ ...prev, image: imgUrl }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (!formData.title?.trim()) {
      newErrors.title = 'Property title is required';
      isValid = false;
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
      isValid = false;
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Street address is required';
      isValid = false;
    }
    
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (id) {
      updateListing(id, formData);
    } else {
      addListing(formData as any);
    }
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/listings');
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    navigate('/listings/new');
    setFormData({
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
      image: '',
      images: []
    });
    window.scrollTo(0, 0);
  };

  const getInputClassName = (errorKey: string) => {
    const base = "w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors ";
    if (errors[errorKey]) {
      return base + "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30";
    }
    return base + "border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary";
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 pb-24 relative">
      {/* Portal for Header Actions */}
      {headerActionsContainer && createPortal(<HeaderButtons />, headerActionsContainer)}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#15202b] rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700 animate-[fadeIn_0.2s_ease-out]">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-round text-3xl">check</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Success!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              The property listing has been successfully {id ? 'updated' : 'published'}.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSuccessClose}
                className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30"
              >
                Go to Listings
              </button>
              {!id && (
                <button 
                  onClick={handleAddAnother}
                  className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Add Another Property
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Sunset Villa with Pool" 
              className={getInputClassName('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span className="material-icons-round text-[14px]">error_outline</span> {errors.title}</p>}
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <span className="material-icons-round text-lg">search</span>
                     </span>
                     <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`${getInputClassName('address')} pl-10`} 
                        placeholder="Search address or enter manually" 
                     />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span className="material-icons-round text-[14px]">error_outline</span> {errors.address}</p>}
               </div>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                     City <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={getInputClassName('city')} />
                  {errors.city && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span className="material-icons-round text-[14px]">error_outline</span> {errors.city}</p>}
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
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Price <span className="text-red-500">*</span>
               </label>
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">₦</span>
                  <input 
                     type="number" 
                     name="price" 
                     value={formData.price || ''} 
                     onChange={handleChange} 
                     placeholder="0.00"
                     className={`${getInputClassName('price')} pl-8 font-mono`} 
                  />
               </div>
               {errors.price && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span className="material-icons-round text-[14px]">error_outline</span> {errors.price}</p>}
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

      {/* Media Redesign */}
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
            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center transition-colors hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden" 
                />
                <div className="h-12 w-12 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center mb-4">
                    <span className="material-icons-round text-2xl text-primary">cloud_upload</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Click to upload or drag and drop</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">SVG, PNG, JPG or GIF (max. 3MB)</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        Select Files
                    </button>
                </div>
                {/* Fallback URL Input */}
                <div className="w-full max-w-sm mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Or import from URL (Press Enter)</p>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons-round text-slate-400">link</span>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Paste image URL..." 
                            onKeyDown={handleUrlAdd}
                            className="w-full pl-9 py-2 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
                        />
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gallery ({formData.images?.length || 0})</h3>
                    <span className="text-xs text-slate-500">First image will be the cover</span>
                </div>
                
                {formData.images && formData.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => removeImage(idx)}
                                            className="p-1 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                                            title="Remove Image"
                                        >
                                            <span className="material-icons-round text-sm">close</span>
                                        </button>
                                    </div>
                                    
                                    {formData.image === img ? (
                                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded w-full text-center">
                                            COVER PHOTO
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => setAsCover(img)}
                                            className="bg-white/20 hover:bg-white hover:text-primary text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm transition-colors"
                                        >
                                            SET AS COVER
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400 text-sm italic">
                        No images uploaded yet.
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AddListing;