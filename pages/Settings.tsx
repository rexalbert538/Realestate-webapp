import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

const Settings: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { addActivity, addNotification } = useActivity();
  const [headerActionsContainer, setHeaderActionsContainer] = useState<Element | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setHeaderActionsContainer(document.getElementById('header-actions'));
    
    if (user) {
        const nameParts = user.name.split(' ');
        setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || '',
            avatar: user.avatar || ''
        });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
      if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        if (saveStatus === 'saved') setSaveStatus('idle');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
      setSaveStatus('saving');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateProfile({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          avatar: formData.avatar
      });
      
      addActivity({
        type: 'update',
        title: 'Profile Updated',
        description: 'User profile details were updated.',
        icon: 'person',
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-100 dark:bg-blue-900/30'
      });

      addNotification({
        title: 'Profile Saved',
        message: 'Your profile changes have been saved.',
        type: 'success'
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleUpdatePassword = () => {
      if (!passwordData.new || !passwordData.confirm) {
          setPasswordMessage({ type: 'error', text: 'Please enter a new password' });
          return;
      }
      if (passwordData.new !== passwordData.confirm) {
          setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
          return;
      }
      if (passwordData.new.length < 8) {
          setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
          return;
      }

      // In a real app, we'd verify current password with backend
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ current: '', new: '', confirm: '' });

      addActivity({
        type: 'update',
        title: 'Security Update',
        description: 'Account password was changed.',
        icon: 'lock',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-100 dark:bg-amber-900/30'
      });
  };

  const handleDeactivateConfirm = () => {
      // In a real app, call API to deactivate
      setIsDeactivateModalOpen(false);
      logout();
  };

  const HeaderButtons = () => (
    <div className="flex items-center gap-3">
        {saveStatus === 'saved' && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-[fadeIn_0.3s_ease-out]">Changes Saved!</span>
        )}
        <button 
            onClick={handleSaveProfile}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-primary/30 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {saveStatus === 'saving' ? (
                <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                </>
            ) : (
                <>
                    <span className="material-icons-round text-sm">save</span>
                    Save Changes
                </>
            )}
        </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 pb-24 relative">
      {/* Portal for Header Actions */}
      {headerActionsContainer && createPortal(<HeaderButtons />, headerActionsContainer)}

      {/* Deactivate Account Modal */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#15202b] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-[fadeIn_0.2s_ease-out]">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 mx-auto">
              <span className="material-icons-round text-2xl">warning_amber</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Deactivate Account?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Are you sure you want to deactivate your account? This will temporarily disable your profile and listings. You will be logged out immediately.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeactivateModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeactivateConfirm}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-sm shadow-red-600/30 transition-colors"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

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
              <img 
                src={formData.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdTpPmI7e_qX5FvAM_PbV_9jIT3W4FjFdHZZ0wSrakLx1W-JexxK96TfrEjHJCr6N3k019yqTR_MFJOE5M1ONsd-3Z70Uv4Gti2XbsBJpBljKrmTHXRlXUfjXKnFlTXbH-q1JMgOsI9xNRGKJPEZWHFqkIvKGlzh1Fc1gv6ZkhGIHRTf3cYu4M6Bb5J3ONRWtYZ3Dm1rvRogPZvkiaXYV_O8XKUsOeDTXv5qE_Ss4kWds-vIWmPZZJUiSyFZzldA-NFwuXKYQyxg"} 
                alt="Profile" 
                className="h-32 w-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 bg-slate-200" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <span className="material-icons-round text-white">camera_alt</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary font-medium hover:text-blue-600"
            >
              Change Picture
            </button>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleProfileChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-24 resize-none"
              ></textarea>
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
              <input 
                type="password" 
                name="current"
                value={passwordData.current}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input 
                type="password" 
                name="new"
                value={passwordData.new}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                name="confirm"
                value={passwordData.confirm}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary" 
              />
            </div>
          </div>
          
          {passwordMessage.text && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passwordMessage.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                <span className="material-icons-round text-sm">{passwordMessage.type === 'error' ? 'error' : 'check_circle'}</span>
                {passwordMessage.text}
            </div>
          )}

          <div className="flex justify-end">
             <button 
                onClick={handleUpdatePassword}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
             >
                Update Password
             </button>
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
          <button 
            onClick={() => setIsDeactivateModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800"
          >
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;