
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface CreateTeamEventModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

export const CreateTeamEventModal: React.FC<CreateTeamEventModalProps> = ({
  open,
  onClose,
  teamId,
  teamName
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [assignment, setAssignment] = useState('collective');

  const handleContinue = () => {
    console.log('Creating team event:', { title, url, assignment, teamId });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a new team event type</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a new event type for people to book times with.
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Quick Chat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                https://cal.id/team/{teamName.toLowerCase()}/
              </span>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-l-none"
                placeholder="quick-chat"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Assignment</Label>
            <RadioGroup value={assignment} onValueChange={setAssignment}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="collective" id="collective" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="collective" className="font-medium cursor-pointer">
                      Collective
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Schedule meetings when all selected team members are available.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="round-robin" id="round-robin" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="round-robin" className="font-medium cursor-pointer">
                      Round Robin
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cycle meetings between multiple team members.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="managed" id="managed" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="managed" className="font-medium cursor-pointer">
                      Managed Event
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create & distribute event types in bulk to team members
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
