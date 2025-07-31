import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Checkbox } from '../../../components/ui/checkbox';
import { LayoutGrid, Plus, ExternalLink, MoreHorizontal, Edit, Send, UserX } from 'lucide-react';
import { InviteTeamMemberModal } from '../../../components/InviteTeamMemberModal';
import { useToast } from '../../../hooks/use-toast';

export const TeamMembers = () => {
  const { teamId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleColumn, setShowRoleColumn] = useState(true);
  const [showLastActiveColumn, setShowLastActiveColumn] = useState(true);
  const [userImpersonation, setUserImpersonation] = useState(true);
  const [makeTeamPrivate, setMakeTeamPrivate] = useState(false);
  const { toast } = useToast();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Sanskar Yadav',
      email: 'sanskarix@gmail.com',
      role: 'OWNER',
      lastActive: '7/16/2025',
      avatar: '/lovable-uploads/b849b475-852b-4552-92f1-185302b164ba.png',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'ADMIN',
      lastActive: '7/20/2025',
      avatar: '/lovable-uploads/avatar2.png',
      status: 'active'
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'MEMBER',
      lastActive: '7/18/2025',
      avatar: '/lovable-uploads/avatar3.png',
      status: 'active'
    },
    {
      id: 4,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'MEMBER',
      lastActive: '7/22/2025',
      avatar: '/lovable-uploads/avatar4.png',
      status: 'pending'
    }
  ]);

  const handleMemberAdded = (memberData) => {
    const newMember = {
      id: members.length + 1,
      name: memberData.name || memberData.email.split('@')[0],
      email: memberData.email,
      role: 'MEMBER',
      lastActive: '-',
      avatar: '/lovable-uploads/default-avatar.png',
      status: 'pending'
    };
    setMembers([...members, newMember]);
    setShowInviteModal(false);

    toast({
      title: "Invite sent successfully",
      description: `Invitation has been sent to ${memberData.email}`,
    });
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prevSelected =>
      prevSelected.includes(memberId)
        ? prevSelected.filter(id => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleSelectAllMembers = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="py-4 w-full">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  View <LayoutGrid className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 animate-scale-in">
                <div className="space-y-3">
                  <Input placeholder="Search" className="h-8" />
                  <div className="text-sm text-muted-foreground">Toggle columns</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="role-view"
                        checked={showRoleColumn}
                        onCheckedChange={(checked) => setShowRoleColumn(checked === true)}
                      />
                      <label htmlFor="role-view" className="text-sm">Role</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="last-active-view"
                        checked={showLastActiveColumn}
                        onCheckedChange={(checked) => setShowLastActiveColumn(checked === true)}
                      />
                      <label htmlFor="last-active-view" className="text-sm">Last Active</label>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Show all columns
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {selectedMembers.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  Group Meeting
                </Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  Add to Event Type
                </Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  Delete
                </Button>
              </>
            )}
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="hover:scale-105 transition-transform duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Members Table */}
        <div className="border rounded-lg overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedMembers.length === members.length}
                    onCheckedChange={handleSelectAllMembers}
                  />
                </TableHead>
                <TableHead>Member ({members.length})</TableHead>
                {showRoleColumn && <TableHead>Role</TableHead>}
                {showLastActiveColumn && <TableHead>Last Active</TableHead>}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/50 transition-colors duration-200">
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleSelectMember(member.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110"
                      />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  {showRoleColumn && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{member.role}</span>
                        {member.status === 'pending' && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {showLastActiveColumn && (
                    <TableCell>{member.lastActive}</TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-200">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-200">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48" align="end">
                          <div className="space-y-1">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            {member.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Send className="h-4 w-4 mr-2" />
                                Resend Invitation
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
                              <UserX className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Settings */}
        <div className="mt-12 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors duration-200">
            <div>
              <h3 className="text-base font-medium">User Impersonation</h3>
              <p className="text-sm text-muted-foreground">Allows your team Owners/Admins to temporarily sign in as you.</p>
            </div>
            <Switch
              checked={userImpersonation}
              onCheckedChange={setUserImpersonation}
              className="transition-all duration-200"
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors duration-200">
            <div>
              <h3 className="text-base font-medium">Make team private</h3>
              <p className="text-sm text-muted-foreground">Your team members won't be able to see other team members when this is turned on.</p>
            </div>
            <Switch
              checked={makeTeamPrivate}
              onCheckedChange={setMakeTeamPrivate}
              className="transition-all duration-200"
            />
          </div>
        </div>

        <InviteTeamMemberModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onMemberAdded={handleMemberAdded}
        />
      </div>
    </div>
  );
};
