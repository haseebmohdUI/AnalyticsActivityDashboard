import { useState } from 'react';
import { Settings, User, Mail, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';

export function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors">
        <div className="flex items-center">
          {theme === 'light' ? (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          )}
        </div>
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={() => toggleTheme()}
        />
      </div>

      {/* Settings Icon */}
      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
      </button>

      {/* User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md" style={{
            background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
          }}>
            U
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">hmohammed</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Admin</p>
          </div>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 text-slate-600 dark:text-slate-400 transition-transform duration-200 hidden lg:block",
            isDropdownOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-20 overflow-hidden">
              {/* User Info Section */}
              <div className="p-4 text-white" style={{
                background: 'linear-gradient(135deg, #334155 0%, #006aff 60%, #0080ff 100%)'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg shadow-lg">
                    U
                  </div>
                  <div>
                    <p className="font-semibold text-sm">User Name</p>
                    <p className="text-xs opacity-90">Admin Account</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Mail className="w-3.5 h-3.5" />
                    <span>user@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <User className="w-3.5 h-3.5" />
                    <span>ID: #12345</span>
                  </div>
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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
