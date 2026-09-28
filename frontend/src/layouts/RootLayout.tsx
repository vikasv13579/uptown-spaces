import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Users, ShieldCheck } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    const active = location.pathname.startsWith(path);
    return active
      ? 'bg-navy-700/80 text-white font-semibold shadow-xs border-l-3 border-amber-500'
      : 'text-slate-400 hover:bg-navy-800/60 hover:text-slate-200 transition-colors border-l-3 border-transparent';
  };

  return (
    <div className="h-screen w-screen max-h-screen max-w-vw overflow-hidden flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 h-auto md:h-full bg-navy-900 text-white shrink-0 flex flex-col border-r border-navy-800/60">
        <div className="p-5 border-b border-navy-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-navy-950 font-bold shadow-xs">
              <Building2 className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">Uptown Spaces</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Lead Operations</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Navigation
          </div>
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs transition-all ${isActive('/dashboard')}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview & Stats</span>
          </Link>
          <Link
            to="/leads"
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs transition-all ${isActive('/leads')}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Lead Directory</span>
          </Link>
        </nav>

        {/* User / Agent Footer */}
        <div className="p-3.5 m-3 bg-navy-800/50 rounded-xl border border-navy-700/50 flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
            VK
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">Vikas Admin</div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Property Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-card shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-400">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Residential & Commercial Leads</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Database Online
            </span>
          </div>
        </header>

        {/* Main Scrollable Content Container */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
