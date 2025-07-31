import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, ArrowLeft, ChevronDown, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { HeaderMeta } from '@/components/Layout';
const VariableDropdown: React.FC<{
  onSelect: (variable: string) => void;
}> = ({
  onSelect
}) => {
  const variables = ['{EVENT_NAME}', '{EVENT_DATE}', '{EVENT_TIME}', '{EVENT_END_TIME}', '{TIMEZONE}', '{LOCATION}', '{ORGANIZER_NAME}', '{ATTENDEE}', '{ATTENDEE_FIRST_NAME}'];
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          Add variable
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {variables.map(variable => <DropdownMenuItem key={variable} onClick={() => onSelect(variable)}>
            {variable}
          </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
};
export const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setHeaderMeta
  } = useOutletContext<{
    setHeaderMeta: (meta: HeaderMeta) => void;
  }>();
  const template = location.state?.template;
  const editWorkflow = location.state?.editWorkflow;
  
  const [workflowName, setWorkflowName] = useState(template?.title || editWorkflow?.workflowName || '');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(editWorkflow?.selectedEventTypes || []);
  const [trigger, setTrigger] = useState(template?.trigger || editWorkflow?.trigger || '');
  const [triggerTiming, setTriggerTiming] = useState(template?.triggerTiming || editWorkflow?.triggerTiming || 'immediately');
  const [customTime, setCustomTime] = useState(template?.customTime || editWorkflow?.customTime || '');
  const [timeUnit, setTimeUnit] = useState(template?.timeUnit || editWorkflow?.timeUnit || 'hours');

  // Progressive reveal states
  const [showEventTypeSection, setShowEventTypeSection] = useState(!!editWorkflow || !!template);
  const [showTriggerSection, setShowTriggerSection] = useState(!!editWorkflow || !!template);
  const [showActionsSection, setShowActionsSection] = useState(!!editWorkflow || !!template);
  const [actions, setActions] = useState(template?.actions || editWorkflow?.actions || [{
    id: '1',
    type: 'email-attendees',
    expanded: true,
    senderName: 'OneHash',
    messageTemplate: 'Reminder',
    emailSubject: 'Reminder: {EVENT_NAME} - {EVENT_DATE}',
    emailBody: 'Hi {ATTENDEE},\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\nDate & Time: {EVENT_DATE} - {EVENT_END_TIME} {TIMEZONE}\n\nThis reminder was triggered by a Workflow in OneHash Cal.',
    includeCalendar: false,
    phoneNumber: '',
    countryCode: '+1',
    verificationCode: '',
    senderId: '',
    textMessage: ''
  }]);
  const triggerOptions = [{
    value: 'new-booking',
    label: 'When new event is booked'
  }, {
    value: 'before-event',
    label: 'Before event starts'
  }, {
    value: 'event-rescheduled',
    label: 'When event is rescheduled'
  }, {
    value: 'after-event',
    label: 'After event ends'
  }, {
    value: 'event-cancelled',
    label: 'When event is canceled'
  }, {
    value: 'no-show',
    label: 'Invitee is marked no-show'
  }];
  const actionOptions = [{
    value: 'email-host',
    label: 'Send email to host'
  }, {
    value: 'email-attendees',
    label: 'Send email to attendees'
  }, {
    value: 'email-specific',
    label: 'Send email to a specific email address'
  }, {
    value: 'sms-attendees',
    label: 'Send SMS to attendees'
  }, {
    value: 'sms-specific',
    label: 'Send SMS to a specific number'
  }, {
    value: 'whatsapp-attendee',
    label: 'Send WhatsApp message to attendee'
  }, {
    value: 'whatsapp-specific',
    label: 'Send WhatsApp message to a specific number'
  }];
  const eventTypes = {
    personal: [{
      id: '1',
      name: '15 Minute Meeting'
    }, {
      id: '2',
      name: '30 Minute Meeting'
    }, {
      id: '3',
      name: 'Quick Call'
    }],
    teams: [{
      id: '4',
      name: 'Team Standup'
    }, {
      id: '5',
      name: 'Project Review'
    }, {
      id: '6',
      name: 'Client Meeting'
    }]
  };
  useEffect(() => {
    setHeaderMeta({
      title: 'Edit Workflow',
      description: 'Create and manage workflows to automate your event processes',
      enabled: true,
      onEnabledChange: (enabled: boolean) => setHeaderMeta({ 
        title: 'Edit Workflow',
        description: 'Create and manage workflows to automate your event processes',
        enabled,
      }),
    });
  }, [setHeaderMeta]);

  // Watch for text input to show event type section
  useEffect(() => {
    if (workflowName.trim()) {
      setShowEventTypeSection(true);
    }
  }, [workflowName]);

  // Watch for event type selection to show trigger section
  useEffect(() => {
    if (selectedEventTypes.length > 0) {
      setShowTriggerSection(true);
    }
  }, [selectedEventTypes]);

  // Watch for trigger selection to show actions section
  useEffect(() => {
    if (trigger && (triggerTiming === 'immediately' || (triggerTiming === 'custom' && customTime))) {
      setShowActionsSection(true);
    }
  }, [trigger, triggerTiming, customTime]);
  const getTriggerText = () => {
    const selectedTrigger = triggerOptions.find(t => t.value === trigger);
    if (!selectedTrigger) return '';
    const baseText = selectedTrigger.label.toLowerCase();
    if (triggerTiming === 'immediately') {
      return `Immediately when ${baseText.replace('when ', '').replace('before ', '').replace('after ', '')}`;
    } else {
      const timeText = `${customTime} ${timeUnit}`;
      if (trigger === 'before-event') {
        return `${timeText} before event starts`;
      } else if (trigger === 'after-event') {
        return `${timeText} after event ends`;
      } else {
        return `${timeText} after ${baseText.replace('when ', '')}`;
      }
    }
  };
  const handleEventTypeSelection = (categoryId: string, typeId: string) => {
    const isSelected = selectedEventTypes.includes(typeId);
    if (isSelected) {
      setSelectedEventTypes(prev => prev.filter(id => id !== typeId));
    } else {
      setSelectedEventTypes(prev => [...prev, typeId]);
    }
  };
  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      type: 'email-attendees',
      expanded: true,
      senderName: 'OneHash',
      messageTemplate: 'Reminder',
      emailSubject: '',
      emailBody: '',
      includeCalendar: false,
      phoneNumber: '',
      countryCode: '+1',
      verificationCode: '',
      senderId: '',
      textMessage: ''
    };
    setActions([...actions, newAction]);
  };
  const removeAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };
  const updateAction = (actionId: string, field: string, value: any) => {
    setActions(actions.map(action => action.id === actionId ? {
      ...action,
      [field]: value
    } : action));
  };
  const toggleActionExpanded = (actionId: string) => {
    setActions(actions.map(action => action.id === actionId ? {
      ...action,
      expanded: !action.expanded
    } : action));
  };
  const insertVariable = (actionId: string, field: string, variable: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      const currentValue = action[field as keyof typeof action] as string;
      updateAction(actionId, field, currentValue + variable);
    }
  };
  const isEmailAction = (type: string) => {
    return type.includes('email');
  };
  const isSMSAction = (type: string) => {
    return type.includes('sms') || type.includes('whatsapp');
  };
  const handleSaveWorkflow = () => {
    const workflowData = {
      id: editWorkflow?.id || `workflow-${Date.now()}`,
      title: workflowName,
      trigger: getTriggerText(),
      action: actions.map(action => {
        if (action.type.includes('email')) return 'Send emails to attendees';
        if (action.type.includes('sms')) return 'Send SMS to attendees';
        if (action.type.includes('whatsapp')) return 'Send whatsapp to attendees';
        return 'Send emails to attendees';
      }).join(', '),
      enabled: true,
      eventTypeInfo: `Active on ${selectedEventTypes.length} event types`,
      teamName: 'Personal',
      createdAt: editWorkflow?.createdAt || new Date().toISOString()
    };

    // Save to localStorage
    const savedWorkflows = localStorage.getItem('workflows');
    let workflows = savedWorkflows ? JSON.parse(savedWorkflows) : [];
    
    if (editWorkflow) {
      // Update existing workflow
      workflows = workflows.map((w: any) => w.id === editWorkflow.id ? workflowData : w);
    } else {
      // Add new workflow
      workflows.push(workflowData);
    }
    
    localStorage.setItem('workflows', JSON.stringify(workflows));
    navigate('/workflows');
  };
  return <div className="flex p-6 bg-card p-8 justify-center">
      <div className="w-full mx-auto p-6 bg-card"> 
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-full space-y-6 border rounded-lg p-6 bg-card">
            {/* Initial centered section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="workflow-name">
                  Workflow name
                </Label>
                <Input id="workflow-name" value={workflowName} onChange={e => setWorkflowName(e.target.value)} className="mt-2" placeholder="Enter workflow name" />
              </div>

              {/* Event Type Selection - Shows after name is entered */}
              {showEventTypeSection && (
                <div className="animate-slide-in-up">
                  <div>
                  <Label>
                    Which event types will this apply to?
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full mt-2 justify-between">
                        {selectedEventTypes.length > 0 ? `${selectedEventTypes.length} event types selected` : 'Select event types...'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80">
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Personal</h4>
                          {eventTypes.personal.map(type => <div key={type.id} className="flex items-center space-x-2 mb-2">
                              <Checkbox id={type.id} checked={selectedEventTypes.includes(type.id)} onCheckedChange={() => handleEventTypeSelection('personal', type.id)} />
                              <Label htmlFor={type.id} className="text-sm">{type.name}</Label>
                            </div>)}
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Teams</h4>
                          {eventTypes.teams.map(type => <div key={type.id} className="flex items-center space-x-2 mb-2">
                              <Checkbox id={type.id} checked={selectedEventTypes.includes(type.id)} onCheckedChange={() => handleEventTypeSelection('teams', type.id)} />
                              <Label htmlFor={type.id} className="text-sm">{type.name}</Label>
                            </div>)}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                </div>
              )}
            </div>
          </div>

        {/* Trigger Section - Shows after event types selected */}
        {showTriggerSection && (
          <div className="animate-slide-in-up">
            <Card className="animate-slide-in-up">
              <CardHeader>
                <CardTitle>When this happens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  
                  <Select value={trigger} onValueChange={setTrigger}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select an occurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerOptions.map(option => <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {trigger && <div className="animate-fade-in space-y-4">
                    <div>
                      <Label className="text-sm ">
                        How long {trigger === 'before-event' ? 'before' : 'after'} {triggerOptions.find(t => t.value === trigger)?.label.toLowerCase().replace('when ', '').replace('before ', '').replace('after ', '')}?
                      </Label>
                      
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="immediately" name="timing" value="immediately" checked={triggerTiming === 'immediately'} onChange={e => setTriggerTiming(e.target.value)} />
                          <Label htmlFor="immediately" className="text-sm text-muted-foreground ">
                            Immediately when {triggerOptions.find(t => t.value === trigger)?.label.toLowerCase().replace('when ', '').replace('before ', '').replace('after ', '')}
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="custom" name="timing" value="custom" checked={triggerTiming === 'custom'} onChange={e => setTriggerTiming(e.target.value)} />
                          <div className="flex items-center space-x-2 flex-1">
                            <Input value={customTime} onChange={e => setCustomTime(e.target.value)} className="w-20" placeholder="24" onClick={() => setTriggerTiming('custom')} />
                            <Select value={timeUnit} onValueChange={setTimeUnit}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutes">minutes</SelectItem>
                                <SelectItem value="hours">hours</SelectItem>
                                <SelectItem value="days">days</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                              {trigger === 'before-event' ? 'before' : 'after'} {triggerOptions.find(t => t.value === trigger)?.label.toLowerCase().replace('when ', '').replace('before ', '').replace('after ', '')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      
                    </div>

                    {triggerTiming === 'immediately' || triggerTiming === 'custom' && customTime}
                  </div>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions Section - Shows after trigger is configured */}
        {showActionsSection && (
          <div className="animate-slide-in-up">
            <Card className="animate-slide-in-up">
              <CardHeader>
                <CardTitle>Do this</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actions.map((action, index) => <Card key={action.id} className="border">
                    <Collapsible open={action.expanded} onOpenChange={() => toggleActionExpanded(action.id)}>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs font-medium">📧</span>
                            </div>
                            <Select value={action.type} onValueChange={value => updateAction(action.id, 'type', value)}>
                              <SelectTrigger className="w-64">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {actionOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-2">
                                <ChevronDown className={`h-4 w-4 transition-transform ${action.expanded ? 'rotate-180' : ''}`} />
                              </Button>
                            </CollapsibleTrigger>
                            {actions.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)} className="p-2">
                                <Trash2 className="h-4 w-4" />
                              </Button>}
                          </div>
                        </div>

                        <CollapsibleContent className="mt-4">
                          <div className="space-y-4">
                            {isEmailAction(action.type) && <>
                                <div>
                                  <Label htmlFor={`sender-${action.id}`}>Sender name</Label>
                                  <Input id={`sender-${action.id}`} value={action.senderName} onChange={e => updateAction(action.id, 'senderName', e.target.value)} className="mt-1" />
                                </div>

                                <div>
                                  <Label htmlFor={`template-${action.id}`}>Choose a template</Label>
                                  <Select value={action.messageTemplate} onValueChange={value => updateAction(action.id, 'messageTemplate', value)}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Custom">Custom</SelectItem>
                                      <SelectItem value="Reminder">Reminder</SelectItem>
                                      <SelectItem value="Thank You">Thank You</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`subject-${action.id}`}>Subject Line</Label>
                                    <VariableDropdown onSelect={variable => insertVariable(action.id, 'emailSubject', variable)} />
                                  </div>
                                  <Input id={`subject-${action.id}`} value={action.emailSubject} onChange={e => updateAction(action.id, 'emailSubject', e.target.value)} className="mt-1" />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`body-${action.id}`}>Email Body</Label>
                                    <VariableDropdown onSelect={variable => insertVariable(action.id, 'emailBody', variable)} />
                                  </div>
                                  <Textarea id={`body-${action.id}`} value={action.emailBody} onChange={e => updateAction(action.id, 'emailBody', e.target.value)} className="mt-1 min-h-32" placeholder="Enter email content..." />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`calendar-${action.id}`} checked={action.includeCalendar} onCheckedChange={checked => updateAction(action.id, 'includeCalendar', checked)} />
                                  <Label htmlFor={`calendar-${action.id}`} className="text-sm">
                                    Include Calendar Event
                                  </Label>
                                </div>
                              </>}

                            {isSMSAction(action.type) && <>
                                <div>
                                  <Label htmlFor={`phone-${action.id}`}>Custom Phone Number</Label>
                                  <div className="flex mt-1">
                                    <Select value={action.countryCode} onValueChange={value => updateAction(action.id, 'countryCode', value)}>
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="+1">+1</SelectItem>
                                        <SelectItem value="+44">+44</SelectItem>
                                        <SelectItem value="+91">+91</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input id={`phone-${action.id}`} value={action.phoneNumber} onChange={e => updateAction(action.id, 'phoneNumber', e.target.value)} className="flex-1 ml-2" placeholder="Phone number" />
                                    <Button size="sm" className="ml-2">
                                      Send Code
                                    </Button>
                                  </div>
                                </div>

                                {action.phoneNumber && <div>
                                    <Label htmlFor={`verification-${action.id}`}>Verification code</Label>
                                    <div className="flex mt-1">
                                      <Input id={`verification-${action.id}`} value={action.verificationCode} onChange={e => updateAction(action.id, 'verificationCode', e.target.value)} className="flex-1" placeholder="Enter verification code" />
                                      <Button size="sm" className="ml-2">
                                        Verify
                                      </Button>
                                    </div>
                                  </div>}

                                <div>
                                  <Label htmlFor={`sender-id-${action.id}`}>Sender ID</Label>
                                  <Input id={`sender-id-${action.id}`} value={action.senderId} onChange={e => updateAction(action.id, 'senderId', e.target.value)} className="mt-1" />
                                </div>

                                <div>
                                  <Label htmlFor={`template-${action.id}`}>Choose a template</Label>
                                  <Select value={action.messageTemplate} onValueChange={value => updateAction(action.id, 'messageTemplate', value)}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Custom">Custom</SelectItem>
                                      <SelectItem value="Reminder">Reminder</SelectItem>
                                      <SelectItem value="Thank You">Thank You</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`text-message-${action.id}`}>Text Message</Label>
                                    <VariableDropdown onSelect={variable => insertVariable(action.id, 'textMessage', variable)} />
                                  </div>
                                  <Textarea id={`text-message-${action.id}`} value={action.textMessage} onChange={e => updateAction(action.id, 'textMessage', e.target.value)} className="mt-1 min-h-32" placeholder="Enter text message..." />
                                </div>
                              </>}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </Card>)}
                
                <Button variant="ghost" onClick={addAction} className="w-full border-dashed border-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add action
                </Button>
              </CardContent>
            </Card> 
          </div>
        )}
        </div>
      </div>
    </div>;
};