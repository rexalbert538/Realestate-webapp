import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    if (matchPath("/listings/edit/:id", location.pathname)) return 'Edit Property';
    
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/listings': return 'My Listings Management';
      case '/listings/new': return 'Add New Property';
      case '/leads': return 'Leads Management';
      case '/settings': return 'Admin Settings';
      default: return 'Dashboard';
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
    }`;

  const iconClass = (isActive: boolean) =>
    `material-icons-round transition-colors ${
      isActive ? '' : 'group-hover:text-primary'
    }`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#15202b] border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white">
            <span className="material-icons-round text-primary">apartment</span>
            <span>EstateAdmin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink to="/" className={navLinkClass} end>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>dashboard</span>
                <span className="font-medium">Dashboard</span>
              </>
            )}
          </NavLink>
          <NavLink to="/listings" className={navLinkClass} end>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>list_alt</span>
                <span className="font-medium">My Listings</span>
              </>
            )}
          </NavLink>
          <NavLink to="/listings/new" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>add_circle</span>
                <span className="font-medium">New Listing</span>
              </>
            )}
          </NavLink>
          <NavLink to="/leads" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>people</span>
                <span className="font-medium">Leads</span>
                <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </>
            )}
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>settings</span>
                <span className="font-medium">Settings</span>
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-2">
            <img
              alt="User Profile"
              className="h-10 w-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdTpPmI7e_qX5FvAM_PbV_9jIT3W4FjFdHZZ0wSrakLx1W-JexxK96TfrEjHJCr6N3k019yqTR_MFJOE5M1ONsd-3Z70Uv4Gti2XbsBJpBljKrmTHXRlXUfjXKnFlTXbH-q1JMgOsI9xNRGKJPEZWHFqkIvKGlzh1Fc1gv6ZkhGIHRTf3cYu4M6Bb5J3ONRWtYZ3Dm1rvRogPZvkiaXYV_O8XKUsOeDTXv5qE_Ss4kWds-vIWmPZZJUiSyFZzldA-NFwuXKYQyxg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <span className="material-icons-round text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Sticky Header */}
        <header className="h-16 bg-white/80 dark:bg-[#15202b]/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <span className="material-icons-round">menu</span>
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {/* Portal Target for Page Actions */}
             <div id="header-actions" className="flex items-center gap-3"></div>

             {/* Dynamic Header Actions based on Route - Fallbacks */}
            {location.pathname === '/' && (
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                  <span className="material-icons-round">notifications</span>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#15202b]"></span>
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">Oct 24, 2023</span>
              </div>
            )}
             {/* Leads Header Actions */}
             {location.pathname === '/leads' && (
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
                    <span className="material-icons-round">notifications</span>
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2">
                    <span className="material-icons-round text-sm">add</span>
                    Add Lead
                  </button>
                </div>
             )}
             {/* Settings Header Actions */}
             {location.pathname === '/settings' && (
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2">
                    <span className="material-icons-round text-sm">save</span>
                    Save Changes
                  </button>
                </div>
             )}
              {/* Listings Header Actions */}
              {location.pathname === '/listings' && (
                <div className="flex items-center gap-3">
                  <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-icons-round text-sm">filter_list</span>
                    Filter
                  </button>
                  <NavLink to="/listings/new" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2">
                    <span className="material-icons-round text-sm">add</span>
                    New Listing
                  </NavLink>
                </div>
             )}
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className={`flex-1 overflow-x-hidden ${location.pathname === '/leads' ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;