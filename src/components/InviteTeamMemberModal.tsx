
import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User, Users, Paperclip, Link } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onMemberAdded: (member: any) => void;
}

export const InviteTeamMemberModal = ({ open, onClose, onMemberAdded }: InviteTeamMemberModalProps) => {
  const [inviteType, setInviteType] = useState<'individual' | 'bulk'>('individual');
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('Member');

  const handleSendInvite = () => {
    if (inviteType === 'individual' && email.trim()) {
      const member = {
        name: email.split('@')[0],
        email: email,
        url: `https://cal.id/${email.split('@')[0]}`,
        role: role,
        isYou: false
      };
      onMemberAdded(member);
      setEmail('');
    } else if (inviteType === 'bulk' && emails.trim()) {
      const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
      emailList.forEach(emailAddr => {
        const member = {
          name: emailAddr.split('@')[0],
          email: emailAddr,
          url: `https://cal.id/${emailAddr.split('@')[0]}`,
          role: role,
          isYou: false
        };
        onMemberAdded(member);
      });
      setEmails('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Invite team member</h2>
          </div>

          <div className="flex border rounded-lg p-1">
            <button
              onClick={() => setInviteType('individual')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                inviteType === 'individual' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Invite individual</span>
            </button>
            <button
              onClick={() => setInviteType('bulk')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                inviteType === 'bulk' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Bulk import</span>
            </button>
          </div>

          {inviteType === 'individual' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Invite as</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Invite via email</Label>
                <Textarea
                  id="emails"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="john@doe.com, alex@smith.com"
                  className="min-h-32"
                />
              </div>

              <Button variant="outline" className="w-full">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload a .csv file
              </Button>

              <div className="space-y-2">
                <Label htmlFor="bulkRole">Invite as</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Link className="h-4 w-4" />
              <span>Copy invite link</span>
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendInvite}
                disabled={inviteType === 'individual' ? !email.trim() : !emails.trim()}
              >
                Send invite
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
