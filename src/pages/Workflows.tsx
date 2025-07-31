import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Workflow, ChevronDown, MoreHorizontal, Mail, MessageSquare, MessageCircle, Clock2, Check, Zap } from 'lucide-react';
import { CreateWorkflowModal } from '@/components/CreateWorkflowModal';
import { HeaderMeta } from '@/components/Layout';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface WorkflowCardProps {
  workflow: any;
  onEdit: (workflowId: string) => void;
  onToggle: (workflowId: string, enabled: boolean) => void;
  onDuplicate: (workflowId: string) => void;
  onDelete: (workflowId: string) => void;
  onCopyLink: (workflowId: string) => void;
  copiedLink: string | null;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onEdit,
  onToggle,
  onDuplicate,
  onDelete,
  onCopyLink,
  copiedLink
}) => {
  const handleCardClick = () => {
    onEdit(workflow.id);
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground text-base">{workflow.title}</h3>
            <div className="flex items-center space-x-2">
              <Switch
                checked={workflow.enabled}
                onCheckedChange={checked => {
                  onToggle(workflow.id, checked);
                }}
                onClick={e => e.stopPropagation()} // prevent card click
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={e => e.stopPropagation()} // prevent card click
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onEdit(workflow.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(workflow.id)}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCopyLink(workflow.id)}>
                    {copiedLink === workflow.id ? 'Copied!' : 'Copy link'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(workflow.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-3">{workflow.trigger}</p>

          <div className="flex items-center justify-start space-x-2">
            <span className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded">
              <Zap className="w-3 h-3 mr-1" />
              {workflow.eventTypeInfo}
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded">
              <div className="flex items-center">
                <Check className="h-3 w-3 mr-1" />
                <span className="mr-1">2 Actions added</span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export const Workflows = () => {
  const {
    setHeaderMeta
  } = useOutletContext<{
    setHeaderMeta: (meta: HeaderMeta) => void;
  }>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  React.useEffect(() => {
    setHeaderMeta({
      title: 'Workflows',
      description: 'Automate your scheduling workflow'
    });
  }, [setHeaderMeta]);

  // Load teams from localStorage
  useEffect(() => {
    const personalTeam = {
      id: 'personal',
      name: 'Your account',
      avatar: 'S'
    };
    const savedTeams = localStorage.getItem('teams');
    const loadedTeams = savedTeams ? JSON.parse(savedTeams) : [];
    const exampleTeams = [{
      id: 'team1',
      name: 'Marketing Team',
      avatar: 'M'
    }, {
      id: 'team2',
      name: 'Sales Team',
      avatar: 'S'
    }, {
      id: 'team3',
      name: 'Development Team',
      avatar: 'D'
    }, {
      id: 'team4',
      name: 'Support Team',
      avatar: 'Su'
    }];
    setTeams([personalTeam, ...loadedTeams.map((team: any) => ({
      ...team,
      name: team.name
    })), ...exampleTeams]);
  }, []);

  // Load sample workflows and check for saved ones
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    let loadedWorkflows = savedWorkflows ? JSON.parse(savedWorkflows) : [];
    
    // If no saved workflows, use sample data
    if (loadedWorkflows.length === 0) {
      loadedWorkflows = [{
        id: 'workflow-1',
        title: 'Meeting Reminder Emails',
        trigger: '24 hours after new event is booked',
        action: 'Send emails to attendees',
        enabled: true,
        eventTypeInfo: 'Active on 3 event types',
        teamName: 'Personal',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        id: 'workflow-2',
        title: 'Post-Meeting Follow Up',
        trigger: 'Immediately when after event ends',
        action: 'Send emails to host',
        enabled: true,
        eventTypeInfo: 'Active on Team Standup',
        teamName: 'Support Team',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        id: 'workflow-3',
        title: 'Cancellation Notification',
        trigger: 'Immediately when event is canceled',
        action: 'Send SMS to attendees',
        enabled: false,
        eventTypeInfo: 'Active on all event types',
        teamName: 'Sales Team',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        id: 'workflow-4',
        title: 'No-Show Alert',
        trigger: 'Immediately when invitee is marked no-show',
        action: 'Send emails to host',
        enabled: true,
        eventTypeInfo: 'Active on 2 event types',
        teamName: 'Development Team',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'workflow-5',
        title: 'No-Show Alert',
        trigger: 'Immediately when invitee is marked no-show',
        action: 'Send whatsapp to attendees',
        enabled: true,
        eventTypeInfo: 'Active on 1 event types',
        teamName: 'Development Team',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    }
    setWorkflows(loadedWorkflows);
  }, []);

  const handleCreateWorkflow = () => {
    navigate('/workflows/templates');
  };

  const handleWorkflowModalContinue = () => {
    setShowCreateModal(false);
    navigate('/workflows/new');
  };

  const handleWorkflowEdit = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      // Transform workflow data to match WorkflowBuilder expected format
      const editData = {
        id: workflow.id,
        workflowName: workflow.title,
        trigger: workflow.trigger.includes('24 hours after') ? 'new-booking' : 
                workflow.trigger.includes('before') ? 'before-event' :
                workflow.trigger.includes('after') ? 'after-event' :
                workflow.trigger.includes('canceled') ? 'event-cancelled' :
                workflow.trigger.includes('no-show') ? 'no-show' :
                workflow.trigger.includes('rescheduled') ? 'event-rescheduled' : 'new-booking',
        triggerTiming: workflow.trigger.includes('Immediately') ? 'immediately' : 'custom',
        customTime: workflow.trigger.includes('24 hours') ? '24' : 
                   workflow.trigger.includes('1 hour') ? '1' : 
                   workflow.trigger.includes('2 hours') ? '2' : '24',
        timeUnit: workflow.trigger.includes('hours') ? 'hours' : 'days',
        selectedEventTypes: ['1', '2'], // Default selection, could be enhanced
        actions: [{
          id: '1',
          type: workflow.action.includes('emails to attendees') ? 'email-attendees' :
                workflow.action.includes('emails to host') ? 'email-host' :
                workflow.action.includes('SMS') ? 'sms-attendees' :
                workflow.action.includes('whatsapp') ? 'whatsapp-attendee' : 'email-attendees',
          expanded: true,
          senderName: 'OneHash',
          messageTemplate: 'Reminder',
          emailSubject: `Reminder: {EVENT_NAME} - {EVENT_DATE}`,
          emailBody: `Hi {ATTENDEE_FIRST_NAME},\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\nDate & Time: {EVENT_DATE} - {EVENT_END_TIME} {TIMEZONE}\n\nBest regards,\nOneHash Cal`,
          includeCalendar: true,
          phoneNumber: '',
          countryCode: '+1',
          verificationCode: '',
          senderId: 'OneHash',
          textMessage: workflow.action.includes('SMS') || workflow.action.includes('whatsapp') ? 
                      `Hi {ATTENDEE_FIRST_NAME}, reminder: {EVENT_NAME} starts soon at {EVENT_TIME}.` : ''
        }]
      };
      navigate('/workflows/new', { state: { editWorkflow: editData } });
    }
  };

  const handleWorkflowToggle = (workflowId: string, enabled: boolean) => {
    setWorkflows(prev => prev.map(workflow => workflow.id === workflowId ? {
      ...workflow,
      enabled
    } : workflow));
  };

  const handleWorkflowDuplicate = (workflowId: string) => {
    const workflowToDuplicate = workflows.find(w => w.id === workflowId);
    if (workflowToDuplicate) {
      const duplicatedWorkflow = {
        ...workflowToDuplicate,
        id: `workflow-${Date.now()}`,
        title: `${workflowToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        enabled: false
      };
      setWorkflows(prev => [...prev, duplicatedWorkflow]);
    }
  };

  const handleWorkflowDelete = (workflowId: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
  };

  const handleCopyLink = (workflowId: string) => {
    navigator.clipboard.writeText(`https://cal.id/workflows/${workflowId}`);
    setCopiedLink(workflowId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getFilteredTeams = () => {
    const allOption = {
      id: 'all',
      name: 'All',
      avatar: '',
      checked: selectedTeamFilter === 'all'
    };
    const teamOptions = teams.map(team => ({
      ...team,
      checked: selectedTeamFilter === team.id
    }));
    return [allOption, ...teamOptions];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-8 py-6">
        {workflows.length === 0 ? (
          // Empty state
          <div className="max-w-full mx-auto">
            {/* Teams Filter Dropdown */}
            <div className="mb-8">
              <div className="relative inline-block">
                <button 
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)} 
                  className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <span>Teams: All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showTeamDropdown && (
                  <div className="absolute top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {getFilteredTeams().map(team => (
                        <button 
                          key={team.id} 
                          onClick={() => {
                            setSelectedTeamFilter(team.id);
                            setShowTeamDropdown(false);
                          }} 
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center">
                            {team.id === 'all' ? (
                              <div className="h-5 w-5 mr-2" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-2">
                                {team.avatar}
                              </div>
                            )}
                            <span>{team.name}</span>
                          </div>
                          {team.checked && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Empty State Content */}
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Workflow className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <h1 className="text-2xl font-semibold mb-4">Create Workflows</h1>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                With Workflows you can send automated reminders and route notifications to the right person at the right time
              </p>
              
              <Button onClick={handleCreateWorkflow} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Workflow
              </Button>
            </div>
          </div>
        ) : (
          // Workflows display
          <div className="pb-6 space-y-4 w-full max-w-full">

            {/* Teams Filter and New Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <button 
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)} 
                  className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <span>Teams: All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showTeamDropdown && (
                  <div className="absolute top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {getFilteredTeams().map(team => (
                        <button 
                          key={team.id} 
                          onClick={() => {
                            setSelectedTeamFilter(team.id);
                            setShowTeamDropdown(false);
                          }} 
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center">
                            {team.id === 'all' ? (
                              <div className="h-5 w-5 mr-2" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-2">
                                {team.avatar}
                              </div>
                            )}
                            <span>{team.name}</span>
                          </div>
                          {team.checked && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleCreateWorkflow}>
                <Plus className="h-4 w-4" />
                Create Workflow
              </Button>
            </div>

            {/* Workflows List - Single Column */}
            <div className="space-y-4">
              {workflows.map(workflow => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  onEdit={handleWorkflowEdit} 
                  onToggle={handleWorkflowToggle} 
                  onDuplicate={handleWorkflowDuplicate} 
                  onDelete={handleWorkflowDelete} 
                  onCopyLink={handleCopyLink} 
                  copiedLink={copiedLink} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Workflow Modal */}
        <CreateWorkflowModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal} 
          onContinue={handleWorkflowModalContinue} 
        />
      </div>
    </div>
  );
};