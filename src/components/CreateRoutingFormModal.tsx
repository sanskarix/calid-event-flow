
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateRoutingFormModalProps {
  open: boolean;
  onClose: () => void;
  onFormCreated: (form: any) => void;
  teams: any[];
}

export const CreateRoutingFormModal: React.FC<CreateRoutingFormModalProps> = ({
  open,
  onClose,
  onFormCreated,
  teams
}) => {
  const [step, setStep] = useState<'team-select' | 'form-details'>('team-select');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const navigate = useNavigate();

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    setShowTeamDropdown(false);
    setStep('form-details');
  };

  const handleContinue = () => {
    const formData = {
      title: formTitle || 'A Routing Form',
      description: formDescription || 'Form Description',
      teamId: selectedTeam,
      teamName: teams.find(t => t.id === selectedTeam)?.name || 'Your account'
    };
    
    onFormCreated(formData);
    
    // Navigate to edit page
    const formId = `form-${Date.now()}`;
    navigate(`/routing-forms/${formId}/edit`);
    
    // Reset and close
    setStep('team-select');
    setSelectedTeam('');
    setFormTitle('');
    setFormDescription('');
    onClose();
  };

  const handleClose = () => {
    setStep('team-select');
    setSelectedTeam('');
    setFormTitle('');
    setFormDescription('');
    onClose();
  };

  const getSelectedTeamName = () => {
    const team = teams.find(t => t.id === selectedTeam);
    return team?.name || 'Select team';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'team-select' && (
          <>
            <DialogHeader>
              <DialogTitle>Create routing form on</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {team.avatar}
                  </div>
                  <span className="font-medium">{team.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'form-details' && (
          <>
            <DialogHeader>
              <DialogTitle>Add new form</DialogTitle>
              <p className="text-sm text-muted-foreground">Create your form to route a booker</p>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="A Routing Form"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Form Description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
