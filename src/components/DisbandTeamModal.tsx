
import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DisbandTeamModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamName: string;
}

export const DisbandTeamModal = ({ open, onClose, onConfirm, teamName }: DisbandTeamModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Disband Team</h2>
              <p className="text-muted-foreground">
                Are you sure you want to disband this team? Anyone who you've shared this team link with will no longer be able to book using it.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="destructive" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Yes, disband team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
