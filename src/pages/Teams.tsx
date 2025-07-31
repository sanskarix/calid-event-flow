import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Users, MoreHorizontal, Edit, ExternalLink, UserPlus, Trash2, Clock2, Plus } from 'lucide-react';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { TeamCard } from '../components/TeamCard';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';

export const Teams = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDisbandModal, setShowDisbandModal] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  useEffect(() => {
    setHeaderMeta({
      title: 'Teams',
      description: 'Create and manage teams to use collaborative features.',
    });
  }, [setHeaderMeta]);
  
  // Load teams from localStorage on component mount
  useEffect(() => {
    const loadTeams = () => {
      const savedTeams = localStorage.getItem('teams');
      if (savedTeams) {
        try {
          const parsedTeams = JSON.parse(savedTeams);
          setTeams(parsedTeams);
        } catch (error) {
          console.error('Error loading teams:', error);
        }
      }
    };
    loadTeams();

    // Listen for storage changes to update teams in real-time
    const handleStorageChange = () => {
      loadTeams();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('teamsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teamsUpdated', handleStorageChange);
    };
  }, []);
  const handleTeamUpdate = (teamId: string, completedActions: string[]) => {
    const updatedTeams = teams.map(team => team.id === teamId ? {
      ...team,
      completedActions
    } : team);
    setTeams(updatedTeams);

    // Save to localStorage
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('teamsUpdated'));
  };
  const handleTeamDelete = (teamId: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);

    // Save to localStorage
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('teamsUpdated'));
  };
  const handleTeamCreated = (team: any) => {
    const newTeam = {
      ...team,
      completedActions: []
    };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);

    // Save to localStorage
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('teamsUpdated'));
  };
  return <div className="">
      {teams.length === 0 ?
    // Empty state
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-8">
            <Users className="h-16 w-16 text-muted-foreground" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-4">Create a team to get started</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Create your first team and invite other users to work together.
          </p>
          
          <Button onClick={() => setShowCreateModal(true)}>
            Create a new team
          </Button>
        </div> :
    // Teams display
    <div className="px-8 pt-3 pb-6 space-y-4 w-full max-w-full">
        <div className="flex items-center justify-end mb-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New team
          </Button>
        </div>

          <div className="space-y-4">
            {teams.map((team, index) => (
              <div key={team.id} className="bg-card border border-border rounded-lg p-4 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 hover:bg-muted/70 transition-colors group/icon cursor-pointer"
                      style={{ backgroundColor: '#6366f1' }}
                    >
                      <Users className="h-5 w-5 text-white group-hover/icon:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-foreground text-base">{team.name}</h3>
                        <div className="relative flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                          <span>cal.id/team/{team.url}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://cal.id/team/${team.url}`, '_blank')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
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
              </div>
            ))}
          </div>
        </div>}

      <CreateTeamModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onTeamCreated={handleTeamCreated} />
    </div>;
};
