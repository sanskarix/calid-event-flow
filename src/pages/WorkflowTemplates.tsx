import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Mail, MessageSquare, ArrowLeft, MessageCircle } from 'lucide-react';
import { HeaderMeta } from '@/components/Layout';

const workflowTemplates = [
  {
    id: 'email-reminder-host',
    title: 'Email reminder to host',
    description: 'Never miss an event — get automated email reminders',
    icon: Mail,
    iconColor: 'text-green-600'
  },
  {
    id: 'email-reminder-invitee',
    title: 'Email reminder to invitee',
    description: 'Reduce no-shows — send automated email reminders to invitees',
    icon: Mail,
    iconColor: 'text-green-600'
  },
  {
    id: 'thank-you-email',
    title: 'Send thank you email',
    description: 'Build relationships with a quick thanks',
    icon: Mail,
    iconColor: 'text-green-600'
  },

  {
    id: 'text-reminder-host',
    title: 'Text reminder to host',
    description: 'Never miss an event — set automated text reminders',
    icon: MessageSquare,
    iconColor: 'text-yellow-600'
  },
  {
    id: 'text-reminder-invitee',
    title: 'Text reminder to invitees',
    description: 'Never miss an event — set automated text reminders',
    icon: MessageSquare,
    iconColor: 'text-yellow-600'
  },
  {
    id: 'whatsapp-reminder-guests',
    title: 'WhatsApp reminder to guests',
    description: 'Never miss an event — set automated text reminders',
    icon: MessageCircle,
    iconColor: 'text-green-600'
  }
];

export const WorkflowTemplates = () => {
  const navigate = useNavigate();
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  React.useEffect(() => {
    setHeaderMeta({
      title: 'Workflow Templates',
      description: 'Choose a workflow template to get started'
    });
  }, [setHeaderMeta]);

  const getTemplateData = (templateId: string) => {
    const templateData = {
      'email-reminder-host': {
        workflowName: 'Email reminder to host',
        trigger: 'before-event',
        triggerTiming: 'custom',
        customTime: '24',
        timeUnit: 'hours',
        actions: [{
          id: '1',
          type: 'email-host',
          expanded: true,
          senderName: 'OneHash',
          messageTemplate: 'Reminder',
          emailSubject: 'Reminder: {EVENT_NAME} - {EVENT_DATE}',
          emailBody: 'Hi,\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\nDate & Time: {EVENT_DATE} - {EVENT_END_TIME} {TIMEZONE}\n\nBest regards,\nOneHash Cal',
          includeCalendar: true
        }]
      },
      'email-reminder-invitee': {
        workflowName: 'Email reminder to invitee',
        trigger: 'before-event',
        triggerTiming: 'custom',
        customTime: '24',
        timeUnit: 'hours',
        actions: [{
          id: '1',
          type: 'email-attendees',
          expanded: true,
          senderName: 'OneHash',
          messageTemplate: 'Reminder',
          emailSubject: 'Reminder: {EVENT_NAME} - {EVENT_DATE}',
          emailBody: 'Hi {ATTENDEE_FIRST_NAME},\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\nDate & Time: {EVENT_DATE} - {EVENT_END_TIME} {TIMEZONE}\nLocation: {LOCATION}\n\nSee you soon!',
          includeCalendar: true
        }]
      },
      'thank-you-email': {
        workflowName: 'Send thank you email',
        trigger: 'after-event',
        triggerTiming: 'immediately',
        actions: [{
          id: '1',
          type: 'email-attendees',
          expanded: true,
          senderName: 'OneHash',
          messageTemplate: 'Thankyou',
          emailSubject: 'Thank you for attending {EVENT_NAME}',
          emailBody: 'Hi {ATTENDEE_FIRST_NAME},\n\nThank you for attending {EVENT_NAME}. It was great meeting with you!\n\nBest regards,\n{ORGANIZER_NAME}',
          includeCalendar: false
        }]
      },
      'text-reminder-host': {
        workflowName: 'Text reminder to host',
        trigger: 'before-event',
        triggerTiming: 'custom',
        customTime: '1',
        timeUnit: 'hours',
        actions: [{
          id: '1',
          type: 'sms-specific',
          expanded: true,
          messageTemplate: 'Reminder',
          textMessage: 'Reminder: {EVENT_NAME} starts in 1 hour at {EVENT_TIME}. Location: {LOCATION}',
          phoneNumber: '',
          countryCode: '+1',
          senderId: 'OneHash'
        }]
      },
      'text-reminder-invitee': {
        workflowName: 'Text reminder to invitees',
        trigger: 'before-event',
        triggerTiming: 'custom',
        customTime: '1',
        timeUnit: 'hours',
        actions: [{
          id: '1',
          type: 'sms-attendees',
          expanded: true,
          messageTemplate: 'Reminder',
          textMessage: 'Hi {ATTENDEE_FIRST_NAME}, reminder: {EVENT_NAME} starts in 1 hour at {EVENT_TIME}.',
          senderId: 'OneHash'
        }]
      },
      'whatsapp-reminder-guests': {
        workflowName: 'WhatsApp reminder to guests',
        trigger: 'before-event',
        triggerTiming: 'custom',
        customTime: '2',
        timeUnit: 'hours',
        actions: [{
          id: '1',
          type: 'whatsapp-attendee',
          expanded: true,
          messageTemplate: 'Reminder',
          textMessage: 'Hi {ATTENDEE_FIRST_NAME}! Reminder: {EVENT_NAME} starts in 2 hours at {EVENT_TIME}. Looking forward to seeing you!',
          senderId: 'OneHash'
        }]
      }
    };
    
    return templateData[templateId as keyof typeof templateData] || {};
  };

  const handleTemplateSelect = (template: any) => {
    const templateData = getTemplateData(template.id);
    navigate('/workflows/new', { state: { template: { ...template, ...templateData } } });
  };

  const handleCreateCustomWorkflow = () => {
    navigate('/workflows/new');
  };

  return (
    <div className="p-8">
      <div className="space-y-4 w-full max-w-full">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                    <template.icon className={`h-6 w-6 ${template.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Add workflow
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={handleCreateCustomWorkflow}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Build your own workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};