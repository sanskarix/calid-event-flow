import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { Clock2, Plus, Calendar as CalendarIcon, Search, Edit, Trash2 } from 'lucide-react';
import { format, set } from 'date-fns';
import { cn } from '../../lib/utils';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const OutOfOffice = () => {
  const [showOOODialog, setShowOOODialog] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [provideTeamMember, setProvideTeamMember] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const [oooSchedules, setOOOSchedules] = useState<Array<{
    id: string;
    dateRange: string;
    reason: string;
    notes: string;
    teamMember?: string;
  }>>([{
    id: '1',
    dateRange: 'Jul 11, 2025 - Jul 13, 2025',
    reason: '🏖️ Vacation',
    notes: '',
    teamMember: undefined
  }]);
  const teamMembers = [{
    id: '1',
    name: 'John Doe',
    email: 'john@company.com'
  }, {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com'
  }, {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com'
  }];
  const reasonOptions = [{
    value: 'unspecified',
    label: '🤷 Unspecified',
    emoji: '🤷'
  }, {
    value: 'vacation',
    label: '🏖️ Vacation',
    emoji: '🏖️'
  }, {
    value: 'travel',
    label: '✈️ Travel',
    emoji: '✈️'
  }, {
    value: 'sick',
    label: '🤒 Sick leave',
    emoji: '🤒'
  }, {
    value: 'holiday',
    label: '🎉 Public holiday',
    emoji: '🎉'
  }];
  const handleAddOOO = () => {
    if (dateRange.from) {
      const newOOO = {
        id: Date.now().toString(),
        dateRange: dateRange.to ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}` : format(dateRange.from, 'MMM dd, yyyy'),
        reason: reasonOptions.find(r => r.value === reason)?.label || 'Unspecified',
        notes,
        teamMember: provideTeamMember ? selectedTeamMember : undefined
      };
      setOOOSchedules([...oooSchedules, newOOO]);
      setDateRange({});
      setReason('');
      setNotes('');
      setProvideTeamMember(false);
      setSelectedTeamMember('');
      setShowOOODialog(false);
    }
  };
  const handleDeleteOOO = (id: string) => {
    setOOOSchedules(oooSchedules.filter(schedule => schedule.id !== id));
  };

  useEffect(() => {
    setHeaderMeta({
      title: 'Out of Office',
      description: "Let your bookers know when you're OOO.",
    });
  }, [setHeaderMeta]);

  return <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className='w-full flex justify-end mb-4'>
          <Button onClick={setShowOOODialog.bind(null, true)}>
            <Plus className="h-4 w-4"/>
            Add
          </Button>
      </div>
        <div className="flex items-center justify-between">
          <Dialog open={showOOODialog} onOpenChange={setShowOOODialog}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Go Out of Office</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? dateRange.to ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}` : format(dateRange.from, 'MMM dd, yyyy') : 'Select date range'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="range" selected={dateRange.from && dateRange.to ? {
                      from: dateRange.from,
                      to: dateRange.to
                    } : undefined} onSelect={range => setDateRange(range || {})} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonOptions.map(option => <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} />
                </div>

                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <Label>Provide a link to a team member when OOO</Label>
                    <Switch checked={provideTeamMember} onCheckedChange={setProvideTeamMember} />
                  </div>

                  {provideTeamMember && <div className="space-y-2">
                      <Label>Select team member</Label>
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                        <div className="relative mb-2">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search team members..." className="pl-8" />
                        </div>
                        <div className="space-y-1">
                          {teamMembers.map(member => <div key={member.id} className={`p-2 rounded cursor-pointer hover:bg-muted ${selectedTeamMember === member.name ? 'bg-muted' : ''}`} onClick={() => setSelectedTeamMember(member.name)}>
                              <div className="font-medium text-sm">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>)}
                        </div>
                      </div>
                    </div>}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowOOODialog(false)}>
                    Close
                  </Button>
                  <Button onClick={handleAddOOO}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-card">
        {oooSchedules.length > 0 ? <div className="space-y-6">
            {oooSchedules.map(schedule => <div key={schedule.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{schedule.dateRange}</h3>
                      <p className="text-sm text-muted-foreground">No forwarding</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Out of Office</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Dates</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {schedule.dateRange}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="range" initialFocus className={cn("p-3 pointer-events-auto")} />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label>Reason</Label>
                            <Select defaultValue="vacation">
                              <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {reasonOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Additional notes..." rows={3} />
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline">
                              Close
                            </Button>
                            <Button>
                              Update
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteOOO(schedule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>)}
          </div> : <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Clock2 className="h-10 w-10 text-muted-foreground" />
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Create an OOO</h2>
            
            <p className="text-muted-foreground max-w-md leading-relaxed mb-8">
              Communicate to your bookers when you're not available to take bookings. 
              They can still book you upon your return or you can forward them to a team member.
            </p>
          </div>}
        </div>
      </div>
    </div>;
};