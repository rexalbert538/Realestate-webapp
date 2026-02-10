import React, { createContext, useContext, useState, useEffect } from 'react';
import { LISTINGS } from '../constants';
import { Listing } from '../types';
import { useActivity } from './ActivityContext';

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'dateAdded'>) => void;
  updateListing: (id: string, updatedData: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListing: (id: string) => Listing | undefined;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addActivity, addNotification } = useActivity();

  // Initialize with fake data
  useEffect(() => {
    // Check if we have data in local storage, otherwise use constants
    const stored = localStorage.getItem('estate_admin_listings');
    if (stored) {
      try {
        setListings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse listings from local storage", e);
        setListings(LISTINGS);
      }
    } else {
      setListings(LISTINGS);
    }
    setIsInitialized(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    // Only sync if initialized to prevent overwriting with empty state on mount
    if (isInitialized) {
      localStorage.setItem('estate_admin_listings', JSON.stringify(listings));
    }
  }, [listings, isInitialized]);

  const addListing = (data: Omit<Listing, 'id' | 'dateAdded'>) => {
    const newListing: Listing = {
      ...data,
      id: Math.floor(Math.random() * 10000).toString(),
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setListings(prev => [newListing, ...prev]);

    addActivity({
      type: 'listing',
      title: 'New Listing Added',
      description: `"${data.title}" was published.`,
      icon: 'add_home',
      colorClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-100 dark:bg-green-900/30'
    });

    addNotification({
      title: 'Listing Published',
      message: `"${data.title}" is now active.`,
      type: 'success'
    });
  };

  const updateListing = (id: string, updatedData: Partial<Listing>) => {
    const originalListing = listings.find(l => l.id === id);
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));

    if (originalListing) {
       addActivity({
          type: 'update',
          title: 'Listing Updated',
          description: `Updates made to "${originalListing.title}".`,
          icon: 'edit',
          colorClass: 'text-purple-600 dark:text-purple-400',
          bgClass: 'bg-purple-100 dark:bg-purple-900/30'
       });
    }
  };

  const deleteListing = (id: string) => {
    const listing = listings.find(l => l.id === id);
    setListings(prev => prev.filter(item => item.id !== id));

    if (listing) {
      addActivity({
          type: 'update',
          title: 'Listing Removed',
          description: `"${listing.title}" was removed.`,
          icon: 'delete',
          colorClass: 'text-red-600 dark:text-red-400',
          bgClass: 'bg-red-100 dark:bg-red-900/30'
      });
      addNotification({
          title: 'Listing Deleted',
          message: `"${listing.title}" has been removed.`,
          type: 'warning'
      });
    }
  };

  const getListing = (id: string) => {
    return listings.find(item => item.id === id);
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing, updateListing, deleteListing, getListing }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};