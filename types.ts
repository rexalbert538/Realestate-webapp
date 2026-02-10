
export interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold';
  type: 'Apartment' | 'House' | 'Villa' | 'Commercial' | 'Land' | string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  image: string; // This acts as the "Cover" image
  images?: string[]; // Array of additional images
  dateAdded: string;
  description?: string;
  amenities?: string[];
  city?: string;
  state?: string;
  zip?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyInterest: string;
  propertyPrice: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  source: 'Website' | 'Zillow' | 'Referral';
  date: string;
  avatarColor: string;
  avatarText: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  text: string;
  date: string;
  type: 'system' | 'user';
}

export interface Activity {
  id: string;
  type: 'listing' | 'lead' | 'review' | 'update';
  title: string;
  description: string;
  time: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

export interface Stat {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: string;
  colorClass: string;
  bgClass: string;
}
