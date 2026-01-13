import { useState } from 'react';
import { Settings, User, Mail, LogOut, ChevronDown, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload(); // Reload to reset the app state
  };

  // Get user initials from email
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const email = user.email;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  // Get username from email
  const getUsername = () => {
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  };

  return (
    <div className="relative">
      {/* Floating User Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md" style={{
          background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
        }}>
          {getUserInitials()}
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-xs font-semibold text-slate-900 dark:text-white">{getUsername()}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {user?.hasCeoAccess && user.hasCeoAccess.length > 0 ? 'CEO Access' : 'User'}
          </p>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 hidden lg:block",
          isDropdownOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* User Info Section */}
              <div className="p-4 text-white" style={{
                background: 'linear-gradient(135deg, #334155 0%, #006aff 60%, #0080ff 100%)'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg shadow-lg">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{getUsername()}</p>
                    <p className="text-xs opacity-90">
                      {user?.hasCeoAccess && user.hasCeoAccess.length > 0 ? 'CEO Access' : 'User Account'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{user?.email || 'N/A'}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <User className="w-3.5 h-3.5" />
                    <span>ID: #{user?.indId || 'N/A'}</span>
                  </div> */}
                  {/* {user?.company && user.company.length > 0 && (
                    <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <Building className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{user.company[0]}</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
