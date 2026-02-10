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
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(RECENT_ACTIVITY);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ActivityContext.Provider value={{ activities, notifications, addActivity, addNotification, markAllNotificationsRead, unreadCount }}>
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