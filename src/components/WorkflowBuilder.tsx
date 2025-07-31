import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, X, ArrowLeft, Bold, Italic, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface WorkflowBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: any;
}

interface EventTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (selectedTypes: string[]) => void;
}

const EventTypeDialog: React.FC<EventTypeDialogProps> = ({ open, onOpenChange, onApply }) => {
  const [selectedTab, setSelectedTab] = useState('personal');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const eventTypes = {
    personal: [
      { id: '1', name: '15 Minute Meeting' },
      { id: '2', name: '30 Minute Meeting' },
      { id: '3', name: 'Quick Call' },
    ],
    teams: [
      { id: '4', name: 'Team Standup' },
      { id: '5', name: 'Project Review' },
      { id: '6', name: 'Client Meeting' },
    ],
  };

  const currentTypes = eventTypes[selectedTab as keyof typeof eventTypes];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(currentTypes.map((type) => type.id));
    }
    setSelectAll(!selectAll);
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Event Types</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex border-b">
            <button className={`px-4 py-2 text-sm ${selectedTab === 'personal' ? 'border-b-2 border-primary' : ''}`} onClick={() => setSelectedTab('personal')}>
              Personal
            </button>
            <button className={`px-4 py-2 text-sm ${selectedTab === 'teams' ? 'border-b-2 border-primary' : ''}`} onClick={() => setSelectedTab('teams')}>
              Teams
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
              <Label htmlFor="select-all" className="font-medium">
                Select All
              </Label>
            </div>
            <Separator />
            {currentTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox id={type.id} checked={selectedTypes.includes(type.id)} onCheckedChange={() => handleTypeToggle(type.id)} />
                <Label htmlFor={type.id}>{type.name}</Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onApply(selectedTypes)}>Apply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ open, onOpenChange, template }) => {
  const [workflowName, setWorkflowName] = useState('Custom workflow');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [showEventTypeDialog, setShowEventTypeDialog] = useState(false);

  const [actions, setActions] = useState([
    {
      id: '1',
      type: 'email-attendees',
      senderName: 'OneHash',
      messageTemplate: 'Reminder',
      emailSubject: 'Reminder: {EVENT_NAME} - {EVENT_DATE_ddd, MMM D, YYYY h:mma}',
      emailBody:
        'Hi {ATTENDEE},\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\n\nDate & Time: {EVENT_DATE_ddd, MMM D, YYYY h:mma} - {EVENT_END_TIME} {TIMEZONE}\n\nAttendees: You & {ORGANIZER}\n\nThis reminder was triggered by a Workflow in OneHash Cal.',
      includeCalendar: false,
    },
  ]);

  const actionOptions = [
    { value: 'email-host', label: 'Send email to host' },
    { value: 'email-attendees', label: 'Send email to attendees' },
    { value: 'email-specific', label: 'Send email to a specific email address' },
    { value: 'sms-attendees', label: 'Send SMS to attendees' },
    { value: 'sms-specific', label: 'Send SMS to a specific number' },
    { value: 'whatsapp-attendee', label: 'Send WhatsApp message to attendee' },
    { value: 'whatsapp-specific', label: 'Send WhatsApp message to a specific number' },
  ];

  const handleEventTypesApply = (types: string[]) => {
    setSelectedEventTypes(types);
    setShowEventTypeDialog(false);
  };

  const addAction = () => {
    if (actions.length >= 5) {
      return;
    }
    const newAction = {
      id: Date.now().toString(),
      type: 'email-attendees',
      senderName: 'OneHash',
      messageTemplate: 'Reminder',
      emailSubject: '',
      emailBody: '',
      includeCalendar: false,
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (actionId: string) => {
    setActions(actions.filter((action) => action.id !== actionId));
  };

  const updateAction = (actionId: string, field: string, value: any) => {
    setActions(
      actions.map((action) => (action.id === actionId ? { ...action, [field]: value } : action))
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center space-y-0 space-x-4">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <DialogTitle>Create a workflow</DialogTitle>
              <p className="text-sm text-muted-foreground">Sanskar Yadav</p>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="workflow-name">Workflow name</Label>
                <Input id="workflow-name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} className="mt-1" />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>When this happens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <span className="text-sm">24 hours after new event is booked</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Do this</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actions.map((action, index) => (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-xs font-medium">📧</span>
                          </div>
                          <Select value={action.type} onValueChange={(value) => updateAction(action.id, 'type', value)}>
                            <SelectTrigger className="w-64">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          {actions.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-xs">!</span>
                            </div>
                            <span className="text-sm text-yellow-800">Customize your action</span>
                          </div>
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`sender-${action.id}`}>Sender name</Label>
                          <Input id={`sender-${action.id}`} value={action.senderName} onChange={(e) => updateAction(action.id, 'senderName', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor={`template-${action.id}`}>Message template</Label>
                          <Select value={action.messageTemplate} onValueChange={(value) => updateAction(action.id, 'messageTemplate', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reminder">Reminder</SelectItem>
                              <SelectItem value="Confirmation">Confirmation</SelectItem>
                              <SelectItem value="Thank You">Thank You</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`subject-${action.id}`}>Email subject</Label>
                            <Button variant="ghost" size="sm" className="text-xs">
                              Add variable
                            </Button>
                          </div>
                          <Input id={`subject-${action.id}`} value={action.emailSubject} onChange={(e) => updateAction(action.id, 'emailSubject', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`body-${action.id}`}>Email body</Label>
                            <Button variant="ghost" size="sm" className="text-xs">
                              Add variable
                            </Button>
                          </div>
                          <div className="mt-1 border rounded-md">
                            <div className="flex items-center space-x-2 p-2 border-b bg-muted/30">
                              <Select defaultValue="Normal">
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Normal">Normal</SelectItem>
                                  <SelectItem value="H1">H1</SelectItem>
                                  <SelectItem value="H2">H2</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm">
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Link className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={action.emailBody}
                              onChange={(e) => updateAction(action.id, 'emailBody', e.target.value)}
                              className="border-0 min-h-32 resize-none"
                              placeholder="Enter email content..."
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`calendar-${action.id}`} checked={action.includeCalendar} onCheckedChange={(checked) => updateAction(action.id, 'includeCalendar', checked)} />
                          <Label htmlFor={`calendar-${action.id}`} className="text-sm">
                            Include calendar event
                          </Label>
                        </div>
                        <div className="pt-2">
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                            💡 How do I use booking questions as variables?
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" onClick={addAction} className="w-full border-dashed border-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add action
                  </Button>
                  <div className="text-right text-xs text-muted-foreground">
                    {actions.length}/5 actions added
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <div>
                <Label>Which event types will this apply to?</Label>
                <Button variant="outline" onClick={() => setShowEventTypeDialog(true)} className="w-full mt-1 justify-start text-muted-foreground">
                  {selectedEventTypes.length > 0 ? `${selectedEventTypes.length} event types selected` : 'Select...'}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Delete Workflow
            </Button>
            <Button>Save Workflow</Button>
          </div>
        </DialogContent>
      </Dialog>
      <EventTypeDialog open={showEventTypeDialog} onOpenChange={setShowEventTypeDialog} onApply={handleEventTypesApply} />
    </>
  );
};
