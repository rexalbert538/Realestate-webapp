import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import AddListing from './pages/AddListing';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { LeadsProvider } from './context/LeadsContext';
import { ActivityProvider } from './context/ActivityContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ActivityProvider>
        <ListingsProvider>
          <LeadsProvider>
            <HashRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/listings" element={<Listings />} />
                        <Route path="/listings/new" element={<AddListing />} />
                        <Route path="/listings/edit/:id" element={<AddListing />} />
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/settings" element={<Settings />} />
                        
                        {/* Fallback for protected area */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </HashRouter>
          </LeadsProvider>
        </ListingsProvider>
      </ActivityProvider>
    </AuthProvider>
  );
};

export default App;