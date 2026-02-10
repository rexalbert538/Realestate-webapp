import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { useLeads } from '../context/LeadsContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllNotificationsRead } = useActivity();
  const { leads } = useLeads();

  // Calculate new leads for sidebar badge
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
      setIsNotifOpen(!isNotifOpen);
      if (!isNotifOpen && unreadCount > 0) {
          // In a real app, you might want to mark them read only when viewed or dismissed
          // For now, we keep them unread until user clicks "Mark all read" or similar, 
          // or we can just leave logic here. Let's leave them unread for visual effect.
      }
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
                {newLeadsCount > 0 && (
                  <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {newLeadsCount}
                  </span>
                )}
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
              src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdTpPmI7e_qX5FvAM_PbV_9jIT3W4FjFdHZZ0wSrakLx1W-JexxK96TfrEjHJCr6N3k019yqTR_MFJOE5M1ONsd-3Z70Uv4Gti2XbsBJpBljKrmTHXRlXUfjXKnFlTXbH-q1JMgOsI9xNRGKJPEZWHFqkIvKGlzh1Fc1gv6ZkhGIHRTf3cYu4M6Bb5J3ONRWtYZ3Dm1rvRogPZvkiaXYV_O8XKUsOeDTXv5qE_Ss4kWds-vIWmPZZJUiSyFZzldA-NFwuXKYQyxg"}
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
              <div className="flex items-center gap-3 relative">
                <button 
                    onClick={handleNotificationClick}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors"
                >
                  <span className="material-icons-round">notifications</span>
                  {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#15202b]"></span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotifOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#15202b] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                            <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:text-blue-600 font-medium">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                            <div>
                                                <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{notif.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{notif.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">Oct 24, 2023</span>
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