import React, { createContext, useContext, useState, useEffect } from 'react';
import { LEADS } from '../constants';
import { Lead } from '../types';
import { useActivity } from './ActivityContext';

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { addActivity } = useActivity();

  useEffect(() => {
    const stored = localStorage.getItem('estate_admin_leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        setLeads(LEADS);
      }
    } else {
      setLeads(LEADS);
    }
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('estate_admin_leads', JSON.stringify(leads));
    }
  }, [leads]);

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    addActivity({
      type: 'lead',
      title: 'New Lead Received',
      description: `${lead.name} inquired about property.`,
      icon: 'person_add',
      colorClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-100 dark:bg-blue-900/30'
    });
  };

  const deleteLead = (id: string) => {
    const leadToRemove = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (leadToRemove) {
        addActivity({
            type: 'update',
            title: 'Lead Removed',
            description: `${leadToRemove.name} was removed from leads.`,
            icon: 'delete',
            colorClass: 'text-red-600 dark:text-red-400',
            bgClass: 'bg-red-100 dark:bg-red-900/30'
        });
    }
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};