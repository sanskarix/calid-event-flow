import { NavLink } from 'react-router-dom';
import { Users, Settings, Workflow, Home, CalendarCheck, ScrollText, Clock2, Blocks, ListTree, ChartNoAxesColumnIncreasing, Gift, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}
export const Sidebar = ({
  darkMode,
  setDarkMode
}: SidebarProps) => {
  const navigation = [{
    name: 'Home',
    href: '/',
    icon: Home
  }, {
    name: 'Event Types',
    href: '/event-types',
    icon: ScrollText
  }, {
    name: 'Bookings',
    href: '/bookings',
    icon: CalendarCheck
  }, {
    name: 'Availability',
    href: '/availability',
    icon: Clock2
  }, {
    name: 'Teams',
    href: '/teams',
    icon: Users
  }, {
    name: 'Apps',
    href: '/apps',
    icon: Blocks
  }, {
    name: 'Routing Forms',
    href: '/routing-forms',
    icon: ListTree
  }, {
    name: 'Workflows',
    href: '/workflows',
    icon: Workflow
  }, {
    name: 'Insights',
    href: '/insights',
    icon: ChartNoAxesColumnIncreasing
  }, {
    name: 'Claim Pro for 2 Years',
    href: '/claim-pro',
    icon: Gift
  }, {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }];
  return <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col" style={{
    background: 'linear-gradient(#eff6ff, #eef2ff, #faf5ff)'
  }}>
      <div className="flex h-20 items-center px-6">
        <img src="https://cdn.prod.website-files.com/5e53d34464688e6f5960a338/682f1bb36cedcb0cd39a7027_Onehash-CalId-logo%20icon.svg" alt="Cal ID" className="h-8 w-8" />
        <span className="ml-3 text-xl font-semibold">Cal ID</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navigation.map(item => <NavLink key={item.name} to={item.href} className={({
        isActive
      }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-[#CBD0D6] hover:text-[#001629]'}`}>
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>)}
      </nav>
      
      {/* Bottom section */}
      <div className="px-4 py-4 space-y-3">
        {/* Pro Plan Indicator */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/30 rounded-xl p-3 overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-primary/20 rounded-md">
                  <Crown className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary tracking-wide">PRO PLAN</span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-primary/10 text-primary border-0">ACTIVE</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Expires{' '}
              <span className="font-semibold text-foreground">
                {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              </span>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="space-y-2 text-xs text-muted-foreground">
          
          <div className="text-center">
            <span className="block">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </div>;
};