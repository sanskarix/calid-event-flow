import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Users, Calendar, Palette, Clock2, User } from 'lucide-react';
import { TeamProfile } from './teams/TeamProfile';
import { TeamMembers } from './teams/TeamMembers';
import { TeamAppearance } from './teams/TeamAppearance';
import { TeamBookingLimits } from './teams/TeamBookingLimits';

export const TeamDetail = () => {
  const { teamId, section } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || 'profile');

  const teams = {
    'tech-team': {
      name: 'Tech Team',
      description: 'Development and engineering team',
      color: 'bg-blue-500'
    },
    'marketing-team': {
      name: 'Marketing Team',
      description: 'Marketing and growth team',
      color: 'bg-green-500'
    },
    'design-team': {
      name: 'Design Team',
      description: 'UI/UX and design team',
      color: 'bg-purple-500'
    }
  };

  const team = teams[teamId as keyof typeof teams];

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'booking-limits', name: 'Booking Limits', icon: Clock2 },
  ];

  if (!team) {
    return <div>Team not found</div>;
  }

  const renderSectionContent = () => {
    switch (activeSection) {
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

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="p-8 max-w-4xl w-full">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings/teams/new')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">{team.name}</h1>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
        </div>

        {/* Horizontal Tabs with Underlines */}
        <div className="bg-background mb-6">
          <nav className="flex" aria-label="Tabs">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                  title={section.name}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Event Types Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/settings/teams/${teamId}/event-types`)}
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>View Event Types</span>
          </Button>
        </div>

        {/* Section Content */}
        <div className="">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};
