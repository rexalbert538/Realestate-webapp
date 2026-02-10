import { Activity, Lead, Listing, Stat } from "./types";

export const MOCK_STATS: Stat[] = [
  {
    label: "Total Listings",
    value: "124",
    trend: "+12% this month",
    trendDirection: "up",
    icon: "home_work",
    colorClass: "text-primary",
    bgClass: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    label: "Total Leads",
    value: "86",
    trend: "+5% this week",
    trendDirection: "up",
    icon: "group",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    label: "Property Views",
    value: "12.5k",
    trend: "-2.4% vs last mo",
    trendDirection: "down",
    icon: "visibility",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    label: "Revenue",
    value: "₦45,200",
    trend: "+18% this month",
    trendDirection: "up",
    icon: "attach_money",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-900/20"
  }
];

export const RECENT_ACTIVITY: Activity[] = [
  {
    id: "1",
    type: "listing",
    title: "New Listing Added",
    description: "\"Modern Sunset Villa\" was published by Alex.",
    time: "2 hours ago",
    icon: "add_home",
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-100 dark:bg-green-900/30"
  },
  {
    id: "2",
    type: "lead",
    title: "New Lead Received",
    description: "Sarah J. inquired about \"Downtown Apt\".",
    time: "5 hours ago",
    icon: "person_add",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    id: "3",
    type: "review",
    title: "New Review",
    description: "5-star rating received for your service.",
    time: "1 day ago",
    icon: "comment",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/30"
  },
  {
    id: "4",
    type: "update",
    title: "Listing Updated",
    description: "Price change on \"Luxury Penthouse\".",
    time: "2 days ago",
    icon: "edit",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-900/30"
  }
];

export const LISTINGS: Listing[] = [
  {
    id: "4920",
    title: "Modern Sunset Villa",
    address: "123 Palm Ave, Beverly Hills",
    price: 4250000,
    status: "Active",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMzejqTwJ9uRVxU57STMEiXh4K7JLbsEYelAIvoOIPVGiAHXcms9R5htKpitsoNUXvb4e9owpbl66dVb-AxAJiU9k1NxHleUnY1UoEPjbowev88yHd1neC_tYsUQ7GkxkSvJftxG0-sxgvvsTUqBDFN94EiXSTypZb7OAowEqR-ulA3r0bcCBQErTo7knIjz1pSonwfKFShRM2Anl9tmSYpoFH7BzpUYrI2GzuwwVB3nd2R0hFxXrM2JcZAne81Y-ylrSmMzDYJQ",
    dateAdded: "Oct 24, 2023"
  },
  {
    id: "4918",
    title: "Luxury Downtown Apt",
    address: "450 Main St, Apt 4B, New York",
    price: 850000,
    status: "Pending",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXb18xY6XiOt-jZbFlKIvLWthSYj8_mrvrcNBTgh8hSafC3emCqJrmwFZyg8DlE_w57L1n1ELXLIYMrUaOvDq4D7kDqjOC6XakHB52dTqts5wG0kNBkPWeY6NsjR35xL_0O95XDW2VTY8fvmn_qd8NXopE7zo7dSFLZFpcl9jORX6RHiTgQrhfJsl9ThWtKMDbplvf1kvGqZa39XFHSObJeTI4QUR7095TEmnIgHxkYe4UmeWwpyqbRgOL2iXO3_wpKBljMLYVDw",
    dateAdded: "Oct 20, 2023"
  },
  {
    id: "4915",
    title: "Cozy Seaside Cottage",
    address: "88 Ocean Drive, Malibu",
    price: 3200000,
    status: "Sold",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr9-80xdTdqSGyh3KF6w0mBHsapMFxcukzVh4ckM8yBiNtCFzF_2zsNdkscr4c-RhMWHaA6KHJFh9TiqCGJfUNUpvvSqzcWe5mHgOJTSXXy5r10_g0hq3ZYyufEQDguBst_C4uinD-yY5w3t8cMFCX2HjflM0IeubuUnyfwB8yK4vxeE-VnenXKf6oQTLhYkrun5KknZE92-emMUGrnQspMRDlMWnwUY34BmiGBK_7DIClxpyhACq1qltsdikxPGou3-Znqal0Bg",
    dateAdded: "Sep 15, 2023"
  },
  {
    id: "4912",
    title: "Commercial Office Space",
    address: "500 Tech Park, San Francisco",
    price: 12000,
    status: "Active",
    type: "Commercial",
    sqft: 5000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhTcumSuxDJ0y0c1vYsCBSR_tLBWZ31tB3IcMK_q6HRyJNxUmgVBIejWSK49VRlsGQVw9AmjL5CeUJDuuf1nbsIEUsuvrCyLO_23bPxb-HTJLJtgMThFqeJBq77tMBgAydK_adm_1e_To0a3ypRVS7bc2kxSyvsU6nt-dZDPj7FHIQEA7ZokXTSZcRx13Ref4ksgs3yJgjCwbXWPEu1VX2I6tVYaxnMScqGHGJNug8sJ9t3KeC_S9QG2UhhrpOnLnRAYA1Lzh6_Q",
    dateAdded: "Aug 02, 2023"
  }
];

export const LEADS: Lead[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    propertyInterest: "Modern Sunset Villa",
    propertyPrice: 1250000,
    status: "New",
    source: "Website",
    date: "2 mins ago",
    avatarColor: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    avatarText: "JD",
    notes: [
      { id: '1', text: "Inquired about Modern Sunset Villa via Website form.", date: "Today, 10:23 AM", type: 'user' },
      { id: '2', text: "Lead created automatically from web inquiry.", date: "Today, 10:23 AM", type: 'system' }
    ]
  },
  {
    id: "2",
    name: "Robert Smith",
    email: "robert.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    propertyInterest: "Downtown Loft",
    propertyPrice: 850000,
    status: "Contacted",
    source: "Zillow",
    date: "Yesterday",
    avatarColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    avatarText: "RS",
    notes: []
  },
  {
    id: "3",
    name: "Alice Lee",
    email: "alice.lee@techcorp.com",
    phone: "+1 (555) 333-2222",
    location: "Miami, FL",
    propertyInterest: "Seaside Condo Unit 4B",
    propertyPrice: 550000,
    status: "Qualified",
    source: "Website",
    date: "Oct 24",
    avatarColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    avatarText: "AL",
    notes: []
  },
  {
    id: "4",
    name: "Mike Kogan",
    email: "mkogan@gmail.com",
    phone: "+1 (555) 777-8888",
    location: "Chicago, IL",
    propertyInterest: "Highland Estate",
    propertyPrice: 3200000,
    status: "Closed",
    source: "Referral",
    date: "Oct 20",
    avatarColor: "bg-slate-100 dark:bg-slate-800 text-slate-500",
    avatarText: "MK",
    notes: []
  },
  {
    id: "5",
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    phone: "+1 (415) 555-0922",
    location: "San Francisco, CA",
    propertyInterest: "Modern Sunset Villa",
    propertyPrice: 1250000,
    status: "New",
    source: "Zillow",
    date: "Oct 18",
    avatarColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    avatarText: "SB",
    notes: []
  }
];

export const CHART_DATA = [
  { name: 'Mon', value: 35 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 30 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 75 },
  { name: 'Sun', value: 85 },
];