import { LayoutDashboard, BarChart3, FileText, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import logoSvg from '@/assets/certLogoTaglineSM2optColor.svg';

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard', active: true, expandable: true },
  { icon: FileText, label: 'Reports', href: '#reports', active: false, expandable: false },
  { icon: BarChart3, label: 'Analytics', href: '#analytics', active: false, expandable: false },
];

export function Sidebar({ className }: SidebarProps) {
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);

  const handleDashboardClick = () => {
    setIsDashboardExpanded(prev => !prev);
  };

  return (
    <aside className={cn(
      'w-[15%] h-screen p-6 flex flex-col border-r transition-colors',
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      className
    )}>
      <div className=" mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-5xl font-black tracking-tight" style={{
          fontFamily: "'Raleway', sans-serif",
          background: 'linear-gradient(135deg, #64748b 0%, #006aff 50%, #0080ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginLeft:'4.5rem'
        }}>
          AHRI
        </h1>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-3 text-center leading-tight" style={{
          fontFamily: "'Roboto', sans-serif"
        }}>
          Analytics App User Activities Dashboard
        </p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={item.expandable ? handleDashboardClick : undefined}
                  style={item.active ? {
                    background: 'linear-gradient(135deg, #475569 0%, #006aff 60%, #0080ff 100%)'
                  } : undefined}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200',
                    item.active
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.expandable && (
                    isDashboardExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  )}
                </button>

                {/* Expandable content for Dashboard */}
                {item.expandable && isDashboardExpanded && (
                  <div className="mt-2 ml-4 space-y-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    {/* Date Range Widget */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Date Range
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Select date range"
                          className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Select Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        View Type
                      </label>
                      <select className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white">
                        <option>Overview</option>
                        <option>Detailed</option>
                        <option>Summary</option>
                        <option>Comparison</option>
                      </select>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logo at Bottom */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
        <img
          src={logoSvg}
          alt="AHRI Logo"
          className="w-full h-auto"
          style={{ filter: 'brightness(0.85) contrast(1.1)' }}
        />
      </div>
    </aside>
  );
}
