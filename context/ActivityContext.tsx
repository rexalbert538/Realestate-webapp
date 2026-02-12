import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity } from '../types';
import { RECENT_ACTIVITY } from '../constants';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface ActivityContextType {
  activities: Activity[];
  notifications: Notification[];
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  refreshActivities: () => Promise<void>;
  isLoading: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(RECENT_ACTIVITY);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Welcome', message: 'Welcome to your new dashboard!', time: 'Just now', read: false, type: 'info' },
    { id: '2', title: 'System Update', message: 'Platform updated to v2.4', time: '1 day ago', read: false, type: 'success' }
  ]);

  const addActivity = (data: Omit<Activity, 'id' | 'time'>) => {
    const newActivity: Activity = {
      ...data,
      id: Date.now().toString(),
      time: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addNotification = (data: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotif: Notification = {
      ...data,
      id: Date.now().toString(),
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const refreshActivities = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random new activity (30% chance) to make it feel "live"
    if (Math.random() > 0.7) {
        const templates: Omit<Activity, 'id' | 'time'>[] = [
            { type: 'review', title: 'New Review', description: 'Received a 5-star rating on Zillow.', icon: 'star', colorClass: 'text-amber-500', bgClass: 'bg-amber-100 dark:bg-amber-900/30' },
            { type: 'lead', title: 'Lead Callback', description: 'Follow up required for downtown property.', icon: 'phone_callback', colorClass: 'text-blue-500', bgClass: 'bg-blue-100 dark:bg-blue-900/30' },
            { type: 'update', title: 'System Sync', description: 'Listings synchronized with external MLS.', icon: 'sync', colorClass: 'text-slate-500', bgClass: 'bg-slate-100 dark:bg-slate-800' }
        ];
        
        const randomActivity = templates[Math.floor(Math.random() * templates.length)];
        
        const newActivity: Activity = {
            ...randomActivity,
            id: Date.now().toString(),
            time: 'Just now'
        };
        
        setActivities(prev => [newActivity, ...prev]);
        
        // Also add a notification about it so the user notices something happened
        addNotification({
            title: randomActivity.title,
            message: randomActivity.description,
            type: 'info'
        });
    }
    
    setIsLoading(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ActivityContext.Provider value={{ activities, notifications, addActivity, addNotification, markAllNotificationsRead, unreadCount, refreshActivities, isLoading }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};