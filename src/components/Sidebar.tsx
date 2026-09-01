import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Clock, 
  CheckSquare, 
  TrendingUp, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    logout, 
    documents,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const handleNavClick = (viewId: AppView) => {
    setActiveView(viewId);
    setIsMobileNavOpen(false);
  };

  const pendingApprovalsCount = documents.reduce((acc, doc) => {
    return acc + doc.versions.filter(v => v.approvalStatus === 'pending').length;
  }, 0);

  const urgentApprovalsCount = documents.reduce((acc, doc) => {
    return acc + doc.versions.filter(v => v.approvalStatus === 'pending' && v.approvalPriority === 'urgent').length;
  }, 0);

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    urgentBadge?: number;
  }

  // Employee menu entries
  const employeeNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'knowledge', label: 'Knowledge Center', icon: BookOpen },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'my-updates', label: 'My Updates', icon: Clock },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Admin menu entries
  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'knowledge', label: 'Knowledge Center', icon: BookOpen },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'approval-queue', label: 'Approval Queue', icon: CheckSquare, badge: pendingApprovalsCount, urgentBadge: urgentApprovalsCount },
    { id: 'ai-insights', label: 'AI Insights', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit-trail', label: 'Audit Trail', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = currentUser.role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileNavOpen && (
        <div 
          id="sidebar-mobile-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* 
        MODERN EXPANDING SIDEBAR:
        - Desktop: Default slim icon-only (w-[68px]), expands to w-64 on hover (or when pinned)
        - Mobile: Standard slide-in overlay (w-72)
      */}
      <aside 
        id="minemind-sidebar" 
        className={`group/sidebar fixed inset-y-0 left-0 z-50 bg-[#0E1522] text-[#EFEBE2] flex flex-col flex-shrink-0 border-r border-[#1E293B] select-none h-screen transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:static ${
          isMobileNavOpen 
            ? 'translate-x-0 shadow-2xl w-72 max-w-[85vw]' 
            : '-translate-x-full md:translate-x-0'
        } ${
          isPinned ? 'md:w-64' : 'md:w-[68px] md:hover:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-3.5 border-b border-[#1E293B] bg-[#0A0F1A] flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8892E] via-[#D97706] to-[#8E5D18] flex items-center justify-center text-[#0E1522] font-serif font-black text-xl flex-shrink-0 shadow-inner">
              M
            </div>
            
            {/* Expanded Brand Name */}
            <div className="whitespace-nowrap transition-opacity duration-200 overflow-hidden md:opacity-0 md:group-hover/sidebar:opacity-100 md:w-0 md:group-hover/sidebar:w-auto">
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif font-bold text-base tracking-tight text-white">MINEMIND <span className="text-[#C8892E]">AI</span></h1>
              </div>
              <p className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">CIL Knowledge Hub</p>
            </div>
          </div>

          {/* Desktop Pin/Expand Toggle & Mobile Close */}
          <div className="flex items-center">
            {/* Pin Toggle on Desktop (visible when hovered or pinned) */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className="hidden md:flex p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer opacity-0 group-hover/sidebar:opacity-100"
              title={isPinned ? 'Collapse to icon-only' : 'Pin sidebar expanded'}
            >
              {isPinned ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              id="btn-close-mobile-sidebar"
              onClick={() => setIsMobileNavOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#8F9BAE] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              title="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {/* Section Eyebrow (Revealed on hover) */}
          <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B] whitespace-nowrap overflow-hidden transition-opacity duration-200 md:opacity-0 md:group-hover/sidebar:opacity-100">
            {currentUser.role === 'admin' ? 'Executive Governance' : 'Technical Officer'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`relative w-full flex items-center h-11 px-3 rounded-xl text-sm font-medium transition-all group/item cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C8892E] to-[#B37722] text-[#0E1522] font-semibold shadow-sm'
                    : 'text-[#94A3B8] hover:bg-[#1A2333] hover:text-white'
                }`}
              >
                {/* Active Indicator Bar (Left) */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r" />
                )}

                {/* Icon Container with Notification Dot in compact mode */}
                <div className="relative flex items-center justify-center flex-shrink-0 w-6 h-6">
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#0E1522]' : 'text-[#94A3B8] group-hover/item:text-[#C8892E]'
                  }`} />

                  {/* Compact Notification Pip (when sidebar is slim) */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="md:group-hover/sidebar:hidden absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-[#0E1522]" />
                  )}
                </div>

                {/* Nav Item Label (Revealed smoothly on hover) */}
                <span className="ml-3.5 whitespace-nowrap text-left transition-all duration-200 overflow-hidden md:opacity-0 md:group-hover/sidebar:opacity-100 flex-1">
                  {item.label}
                </span>

                {/* Expanded Badges */}
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="hidden md:group-hover/sidebar:flex md:flex items-center gap-1 ml-auto whitespace-nowrap">
                    {item.urgentBadge && item.urgentBadge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive ? 'bg-[#991B1B] text-white' : 'bg-[#DC2626] text-white animate-pulse'
                      }`}>
                        {item.urgentBadge}🔴
                      </span>
                    )}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-[#0E1522] text-[#C8892E]' : 'bg-[#1E293B] text-[#CBD5E1]'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="p-2.5 border-t border-[#1E293B] bg-[#0A0F1A] overflow-hidden">
          <div className="flex items-center justify-between gap-2.5">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-xs font-mono font-bold text-[#E2E8F0] flex-shrink-0 shadow-xs"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>

              {/* User text details (revealed on hover) */}
              <div className="whitespace-nowrap overflow-hidden transition-opacity duration-200 md:opacity-0 md:group-hover/sidebar:opacity-100 min-w-0">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#94A3B8] font-mono truncate max-w-[110px]">
                  {currentUser.subsidiary} · {currentUser.role}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="btn-logout"
              onClick={() => {
                logout();
                setIsMobileNavOpen(false);
              }}
              className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] rounded-xl transition-colors cursor-pointer flex-shrink-0"
              title="Sign Out of Workstation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
