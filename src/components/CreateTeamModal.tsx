import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowRight, Plus, User, Users } from 'lucide-react';
import { InviteTeamMemberModal } from './InviteTeamMemberModal';
import { CreateTeamEventModal } from './CreateTeamEventModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onTeamCreated: (team: any) => void;
}

export const CreateTeamModal = ({ open, onClose, onTeamCreated }: CreateTeamModalProps) => {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [teamUrl, setTeamUrl] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: 'Sanskar Yadav',
      email: 'sanskar@example.com',
      url: 'https://cal.id/sanskar',
      role: 'Owner',
      isYou: true
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStep1Continue = () => {
    if (teamName.trim()) {
      setTeamUrl(teamName.toLowerCase().replace(/\s+/g, '-'));
      setStep(2);
    }
  };

  const handleStep2Continue = () => {
    setStep(3);
  };

  const handleFinish = () => {
    const team = {
      id: teamUrl,
      name: teamName,
      url: teamUrl,
      members: teamMembers,
      avatar: teamName.charAt(0).toUpperCase()
    };
    
    // Create the team and sync it immediately
    onTeamCreated(team);
    
    // Show success toast
    toast({
      title: "Team created successfully",
      description: `${teamName} has been created and synced to your workspace.`,
    });
    
    // Navigate to the team's profile page
    navigate(`/settings/teams/${teamUrl}/profile`);
    
    // Close modal and reset
    resetModal();
    onClose();
  };

  const handleDoLater = () => {
    const team = {
      id: teamUrl,
      name: teamName,
      url: teamUrl,
      members: teamMembers,
      avatar: teamName.charAt(0).toUpperCase()
    };
    
    // Create the team and sync it immediately
    onTeamCreated(team);
    
    // Show success toast
    toast({
      title: "Team created successfully",
      description: `${teamName} has been created and synced to your workspace.`,
    });
    
    // Navigate to the team's profile page
    navigate(`/settings/teams/${teamUrl}/profile`);
    
    // Close modal and reset
    resetModal();
    onClose();
  };

  const resetModal = () => {
    setStep(1);
    setTeamName('');
    setTeamUrl('');
    setTeamMembers([
      {
        name: 'Sanskar Yadav',
        email: 'sanskar@example.com',
        url: 'https://cal.id/sanskar',
        role: 'Owner',
        isYou: true
      }
    ]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <div className="bg-muted/30 px-8 py-6 border-b">
            <h2 className="text-xl font-semibold mb-2">
              {step === 1 && "Create a new team"}
              {step === 2 && "Add team members"}
              {step === 3 && "Add a new team event type"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {step === 1 && "Create a new team to collaborate with users."}
              {step === 2 && "Invite others to join your team"}
              {step === 3 && "Create a new event type for people to book times with."}
            </p>
            
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            </div>
            
            <div className="flex space-x-2 mt-2">
              <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-foreground' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-foreground' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-foreground' : 'bg-muted'}`} />
            </div>
          </div>

          <div className="p-8">
            {
              
            
              
            
              
            }

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamUrl">Team URL</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
                      cal.id/team/
                    </span>
                    <Input
                      id="teamUrl"
                      value={teamUrl}
                      onChange={(e) => setTeamUrl(e.target.value)}
                      placeholder="acme"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleStep1Continue} className="flex-1" disabled={!teamName.trim()}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <img src="/lovable-uploads/57946723-7df5-4656-9fad-ef1084cab72b.png" alt="Profile" className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Sanskar Yadav</span>
                        <span className="text-sm text-muted-foreground">You</span>
                        <span className="text-sm bg-muted px-2 py-1 rounded">Owner</span>
                      </div>
                      <p className="text-sm text-muted-foreground">https://cal.id/sanskar</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No more results</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteModal(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add team member
                  </Button>
                </div>

                <div className="flex pt-4">
                  <Button onClick={handleStep2Continue} className="w-full">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Title</Label>
                    <Input
                      id="eventTitle"
                      placeholder="Quick Chat"
                      defaultValue="Quick Chat"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="eventUrl">URL</Label>
                    <Input
                      id="eventUrl"
                      value={`https://cal.id/team/${teamUrl}/`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Assignment</Label>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <input type="radio" name="assignment" className="mt-1" />
                          <div>
                            <h4 className="font-medium">Collective</h4>
                            <p className="text-sm text-muted-foreground">Schedule meetings when all selected team members are available.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <input type="radio" name="assignment" className="mt-1" />
                          <div>
                            <h4 className="font-medium">Round Robin</h4>
                            <p className="text-sm text-muted-foreground">Cycle meetings between multiple team members.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <input type="radio" name="assignment" className="mt-1" />
                          <div>
                            <h4 className="font-medium">Managed Event</h4>
                            <p className="text-sm text-muted-foreground">Create & distribute event types in bulk to team members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button onClick={handleFinish} className="w-full">
                    Finish
                  </Button>
                  
                  <button
                    onClick={handleDoLater}
                    className="w-full text-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    I'll do this later
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <InviteTeamMemberModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onMemberAdded={(member) => {
          setTeamMembers([...teamMembers, member]);
          setShowInviteModal(false);
        }}
      />
    </>
  );
};
