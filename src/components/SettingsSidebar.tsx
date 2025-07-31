import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, User, Settings, Calendar, Video, Palette, Clock2, Shield, Lock, Users, Download, Code, Webhook, Key } from 'lucide-react';

export const SettingsSidebar = () => {
  const navigation = [
    {
      title: '',
      items: [
        { name: 'Back', href: '/', icon: ArrowLeft },
      ]
    },
    {
      title: 'Sanskar Yadav',
      items: [
        { name: 'Profile', href: '/settings/profile', icon: User },
        { name: 'General', href: '/settings/general', icon: Settings },
        { name: 'Calendars', href: '/settings/calendars', icon: Calendar },
        { name: 'Conferencing', href: '/settings/conferencing', icon: Video },
        { name: 'Appearance', href: '/settings/appearance', icon: Palette },
        { name: 'Out of office', href: '/settings/out-of-office', icon: Clock2 },
      ]
    },
    {
      title: 'Security',
      items: [
        { name: 'Password', href: '/settings/security/password', icon: Lock },
        { name: 'Impersonation', href: '/settings/security/impersonation', icon: Shield },
      ]
    },
    {
      title: 'Others',
      items: [
        { name: 'Import', href: '/settings/others/import', icon: Download },
      ]
    },
    {
      title: 'Developer',
      items: [
        { name: 'Webhooks', href: '/settings/developer/webhooks', icon: Webhook },
        { name: 'API keys', href: '/settings/developer/api-keys', icon: Key },
      ]
    },
    {
      title: 'Teams',
      items: [
        { name: 'Edit Teams', href: '/settings/teams/edit', icon: Users },
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(#eff6ff, #eef2ff, #faf5ff)'
      }}
    >
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <img 
          src="https://cdn.prod.website-files.com/5e53d34464688e6f5960a338/682f1bb36cedcb0cd39a7027_Onehash-CalId-logo%20icon.svg" 
          alt="Cal ID" 
          className="h-8 w-8" 
        />
        <span className="ml-3 text-xl font-semibold">Cal ID</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-none">
        {navigation.map((section) => (
          <div key={section.title}>
            {section.title && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink 
            key={item.name} 
            to={item.href} 
            className={({ isActive }) => 
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-[#CBD0D6] hover:text-[#001629]'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
