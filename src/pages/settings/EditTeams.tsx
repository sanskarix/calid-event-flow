import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Users, Palette, Clock2, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TeamProfile } from './teams/TeamProfile';
import { TeamMembers } from './teams/TeamMembers';
import { TeamAppearance } from './teams/TeamAppearance';
import { TeamBookingLimits } from './teams/TeamBookingLimits';
import type { HeaderMeta } from '../../components/Layout';

const tabs = [
  {
    id: 'profile',
    name: 'Profile',
    icon: User
  },
  {
    id: 'members',
    name: 'Members',
    icon: Users
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette
  },
  {
    id: 'booking-limits',
    name: 'Booking Limits',
    icon: Clock2
  }
];

export const EditTeams = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <TeamProfile />;
      case 'members':
        return <TeamMembers />;
      case 'appearance':
        return <TeamAppearance />;
      case 'booking-limits':
        return <TeamBookingLimits />;
      default:
        return <TeamProfile />;
    }
  };

  useEffect(() => {
    setHeaderMeta({
      title: 'Edit Teams',
      description: 'Configure team settings, members, and appearance.',
      enabled: true,
      onEnabledChange: (enabled: boolean) => {
        setHeaderMeta({
          title: 'Edit Teams',
          description: 'Configure team settings, members, and appearance.',
          enabled,
          onEnabledChange: (newEnabled: boolean) => {
            setHeaderMeta({
              title: 'Edit Teams',
              description: 'Configure team settings, members, and appearance.',
              enabled: newEnabled,
              onEnabledChange: () => {}
            });
          }
        });
      }
    });
  }, [setHeaderMeta]);

  return (
    <div className="min-h-screen bg-background">
      {/* Horizontal Tabs with View Event Types Button */}
      <div className="bg-background px-8">
        <div className="flex items-center justify-between">
          <nav className="flex" aria-label="Tabs">
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id)}
                className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
                  activeTab === tabItem.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
                title={tabItem.name}
              >
                <tabItem.icon className="h-4 w-4" />
                <span>{tabItem.name}</span>
              </button>
            ))}
          </nav>

          {/* View Event Types Button */}
          <div className="py-4">
            <a 
              href="/event-types" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center space-x-1">
              <span>View Event Types</span>
              <ExternalLink className="h-4 w-4" />

            </a>
          </div>
        </div>
      </div>

      {/* Content with proper alignment */}
      <div className="bg-background px-8 pb-6">
        <div className="p-0 max-w-none mx-auto space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

