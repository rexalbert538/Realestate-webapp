import React, { createContext, useContext, useState, useEffect } from 'react';
import { LISTINGS } from '../constants';
import { Listing } from '../types';

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
  };

  const updateListing = (id: string, updatedData: Partial<Listing>) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
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