import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Upload, Trash2, X } from 'lucide-react';

export const TeamProfile = () => {
  const { teamId } = useParams();
  const [teamName, setTeamName] = useState('Test1');
  const [teamUrl, setTeamUrl] = useState('test1');
  const [bio, setBio] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleDeleteTeam = () => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      // Handle team deletion logic here
      console.log('Team deleted');
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="py-4 w-full max-w-full">
        <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200">
          <div className="space-y-6">
            {/* Team Logo Upload Section */}
            <div className="space-y-4">
                          <Label className="text-base font-medium">Profile Picture</Label>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              <img src="/lovable-uploads/b849b475-852b-4552-92f1-185302b164ba.png" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" className="">Upload Avatar</Button>
                              <Button variant="outline" className="">Remove</Button>
                            </div>
                          </div>
                        </div>
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="team-name">Team Name</Label>
              <Input 
                id="team-name" 
                value={teamName} 
                onChange={e => setTeamName(e.target.value)} 
                placeholder="Enter team name"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="team-url">Team URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  cal.id/team/
                </span>
                <Input 
                  id="team-url" 
                  value={teamUrl} 
                  onChange={e => setTeamUrl(e.target.value)} 
                  className="rounded-l-none transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                  placeholder="team-url" 
                />
              </div>
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="A little something about your team" 
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-right items-center pt-4 animate-fade-in">
              <Button className="hover:scale-105 transition-transform duration-200">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
<div className="mt-12 border border-destructive/30 rounded-lg p-6 bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200 animate-fade-in">
    <div className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">Be careful. Account deletion cannot be undone.</p>
    </div>
    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground hover:scale-105 transition-transform duration-200">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete account
    </Button>
</div>

      </div>
    </div>
  );
};
