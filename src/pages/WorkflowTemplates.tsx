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

  const handleTemplateSelect = (template: any) => {
    navigate('/workflows/new', { state: { template } });
  };

  const handleCreateCustomWorkflow = () => {
    navigate('/workflows/new');
  };

  return (
    <div className="p-4">
      <div className="px-8 pt-6 pb-6 space-y-4 w-full max-w-full">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/workflows')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Choose a workflow template</h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <Button
              onClick={handleCreateCustomWorkflow}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Build your own Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
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
        </div>
      </div>
    </div>
  );
};
