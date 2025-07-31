
import React from 'react';
import { Button } from '../../components/ui/button';
import { Plus, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeamNew = () => {
  const navigate = useNavigate();

  const teams = [
    {
      id: 'tech-team',
      name: 'Tech Team',
      description: 'Development and engineering team',
      color: 'bg-blue-500',
      members: 5
    },
    {
      id: 'marketing-team',
      name: 'Marketing Team',
      description: 'Marketing and growth team',
      color: 'bg-green-500',
      members: 3
    },
    {
      id: 'design-team',
      name: 'Design Team',
      description: 'UI/UX and design team',
      color: 'bg-purple-500',
      members: 4
    }
  ];

  const handleTeamClick = (teamId: string) => {
    navigate(`/settings/teams/${teamId}/profile`);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="p-8 max-w-4xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and team members</p>
        </div>

        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleTeamClick(team.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${team.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                    {team.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{team.members} members</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Vertical dotted line */}
        <div className="flex justify-center my-8">
          <div className="h-12 border-l-2 border-dotted border-gray-400" style={{ borderWidth: '3px', borderSpacing: '8px' }}></div>
        </div>

        {/* Add new team button */}
        <div className="text-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create new team
          </Button>
        </div>
      </div>
    </div>
  );
};
