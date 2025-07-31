
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Users, Calendar, Palette, MoreHorizontal, Edit, ExternalLink, UserPlus, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateTeamEventModal } from './CreateTeamEventModal';
import { InviteTeamMemberModal } from './InviteTeamMemberModal';
import { DisbandTeamModal } from './DisbandTeamModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    url: string;
    avatar: string;
    completedActions?: string[];
  };
  isOnlyTeam?: boolean;
  onTeamUpdate: (teamId: string, completedActions: string[]) => void;
  onTeamDelete: (teamId: string) => void;
}

export const TeamCard = ({ team, isOnlyTeam = false, onTeamUpdate, onTeamDelete }: TeamCardProps) => {
  const navigate = useNavigate();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDisbandModal, setShowDisbandModal] = useState(false);
  const completedActions = team.completedActions || [];

  const actions = [
    {
      id: 'invite',
      title: 'Invite team member',
      description: 'Meetings are better with the right team members there. Invite them now.',
      icon: Users,
      buttonText: 'Invite',
      onClick: () => {
        if (isOnlyTeam) {
          setShowInviteModal(true);
        } else {
          navigate(`/settings/teams/${team.id}/members`);
        }
      }
    },
    {
      id: 'create',
      title: 'Collective or round-robin',
      description: 'Book your team members together with collective events or cycle through to get the right person with round-robin.',
      icon: Calendar,
      buttonText: 'Create',
      onClick: () => setShowEventModal(true)
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Manage settings for your booking appearance',
      icon: Palette,
      buttonText: 'Edit',
      onClick: () => navigate(`/settings/teams/${team.id}/appearance`)
    }
  ];

  const handleActionComplete = (actionId: string) => {
    if (!completedActions.includes(actionId)) {
      const newCompletedActions = [...completedActions, actionId];
      onTeamUpdate(team.id, newCompletedActions);
    }
  };

  const handleInviteComplete = () => {
    handleActionComplete('invite');
    setShowInviteModal(false);
  };

  const handleEventCreate = () => {
    handleActionComplete('create');
    setShowEventModal(false);
  };

  const isActionCompleted = (actionId: string) => completedActions.includes(actionId);

  if (!isOnlyTeam) {
    // Simple card for multiple teams
    return (
      <div className="border rounded-lg p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
              {team.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <p className="text-sm text-muted-foreground">https://cal.id/team/{team.url}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/settings/teams/${team.id}/profile`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://cal.id/team/${team.url}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowInviteModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite team member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDisbandModal(true)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Disband Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <InviteTeamMemberModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onMemberAdded={handleInviteComplete}
        />

        <DisbandTeamModal
          open={showDisbandModal}
          onClose={() => setShowDisbandModal(false)}
          onConfirm={() => {
            onTeamDelete(team.id);
            setShowDisbandModal(false);
          }}
          teamName={team.name}
        />
      </div>
    );
  }

  // Full card with recommended next steps for single team
  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white font-semibold text-xl">
            {team.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">https://cal.id/team/{team.url}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Owner</span>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/settings/teams/${team.id}/profile`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://cal.id/team/${team.url}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowInviteModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite team member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDisbandModal(true)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Disband Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Recommended next steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action) => {
            const Icon = action.icon;
            const completed = isActionCompleted(action.id);
            
            return (
              <div key={action.id} className={`border rounded-lg p-6 space-y-4 transition-all duration-200 h-full flex flex-col ${completed ? 'opacity-60 bg-green-50' : 'hover:shadow-md'}`}>
                <div className="flex items-start space-x-3 flex-1">
                  <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${completed ? 'text-green-600' : 'text-orange-500'}`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold text-base mb-2 ${completed ? 'line-through' : ''}`}>{action.title}</h3>
                    <p className={`text-sm text-muted-foreground ${completed ? 'line-through' : ''}`}>
                      {action.description}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={action.onClick}
                  className={`w-full mt-auto ${completed ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}`}
                  variant={completed ? 'outline' : 'default'}
                  disabled={completed}
                  size="sm"
                >
                  {completed ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    action.buttonText
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateTeamEventModal
        open={showEventModal}
        onClose={handleEventCreate}
        teamId={team.id}
        teamName={team.name}
      />

      <InviteTeamMemberModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onMemberAdded={handleInviteComplete}
      />

      <DisbandTeamModal
        open={showDisbandModal}
        onClose={() => setShowDisbandModal(false)}
        onConfirm={() => {
          onTeamDelete(team.id);
          setShowDisbandModal(false);
        }}
        teamName={team.name}
      />
    </div>
  );
};
