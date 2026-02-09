import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 pb-24">
      {/* Profile Settings */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
            <span className="material-icons-round">person</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information and public profile.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative group h-32 w-32">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdTpPmI7e_qX5FvAM_PbV_9jIT3W4FjFdHZZ0wSrakLx1W-JexxK96TfrEjHJCr6N3k019yqTR_MFJOE5M1ONsd-3Z70Uv4Gti2XbsBJpBljKrmTHXRlXUfjXKnFlTXbH-q1JMgOsI9xNRGKJPEZWHFqkIvKGlzh1Fc1gv6ZkhGIHRTf3cYu4M6Bb5J3ONRWtYZ3Dm1rvRogPZvkiaXYV_O8XKUsOeDTXv5qE_Ss4kWds-vIWmPZZJUiSyFZzldA-NFwuXKYQyxg" alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800" />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-icons-round text-white">camera_alt</span>
              </div>
            </div>
            <button className="text-sm text-primary font-medium hover:text-blue-600">Change Picture</button>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
              <input type="text" defaultValue="Alex" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
              <input type="text" defaultValue="Morgan" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" defaultValue="alex@estate.com" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea defaultValue="Senior Real Estate Agent with 10+ years of experience in luxury residential properties." className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-24 resize-none"></textarea>
              <span className="text-xs text-slate-500 mt-1">Brief description for your agent profile.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
            <span className="material-icons-round">lock</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Security</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your password and secure your account.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input type="password" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input type="password" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input type="password" className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add an extra layer of security to your account.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-50 dark:border-red-900/20">
          <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
            <span className="material-icons-round">warning</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Danger Zone</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible account actions.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Deactivate Account</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Temporarily disable your account and listings. You can reactivate anytime.</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;