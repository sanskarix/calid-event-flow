import React, { useState } from 'react';
import { Edit, ExternalLink, Mail, MessageSquare, PencilLine } from 'lucide-react';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
const workflowTemplates = [{
  id: 'sms-reminder',
  name: 'SMS Reminder - 10 minutes before',
  description: 'Send an SMS reminder to attendees 10 minutes before the meeting starts',
  icon: MessageSquare,
  trigger: 'Before event',
  action: 'Send SMS',
  timing: '10 minutes before'
}, {
  id: 'email-reminder',
  name: 'Email Reminder - 30 minutes before',
  description: 'Send an email reminder to attendees 30 minutes before the meeting starts',
  icon: Mail,
  trigger: 'Before event',
  action: 'Send Email',
  timing: '30 minutes before'
}, {
  id: 'thankyou-email',
  name: 'Thank You Email - After meeting',
  description: 'Send a thank you email to attendees after the meeting ends',
  icon: Mail,
  trigger: 'After event',
  action: 'Send Email',
  timing: 'Immediately after'
}];
export const EventWorkflows = () => {
  const [activeWorkflows, setActiveWorkflows] = useState<string[]>(['sms-reminder']);
  const toggleWorkflow = (workflowId: string) => {
    setActiveWorkflows(prev => prev.includes(workflowId) ? prev.filter(id => id !== workflowId) : [...prev, workflowId]);
  };
  return <div className="p-0 max-w-none mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className='text-sm font-medium text-grey-700'>
              {activeWorkflows.length} Active
            </span>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <a href="/workflows" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center space-x-1">
                <span>Create New Workflow</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {workflowTemplates.map(workflow => <div key={workflow.id} className={`w-full p-4 border rounded-lg transition-all ${activeWorkflows.includes(workflow.id) ? 'border-[#008c44]/30 bg-[#008c44]/5' : 'border-border bg-card hover:border-border/60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeWorkflows.includes(workflow.id) ? 'bg-[#008c44]/10' : 'bg-muted'}`}>
                    <workflow.icon className={`h-5 w-5 ${activeWorkflows.includes(workflow.id) ? 'text-[#008c44]' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="font-normal text-sm flex-1">
                    <h4 className="font-semibold mb-1">{workflow.name}</h4>
                    <p className="mb-2">{workflow.description}</p>
                  </div>
                </div>
                <div className='flex items-center mt-1'>
                  <PencilLine className="h-5 w-5 mr-4" />
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch 
                            checked={activeWorkflows.includes(workflow.id)} 
                            onCheckedChange={() => toggleWorkflow(workflow.id)} 
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {activeWorkflows.includes(workflow.id) ? "Disable" : "Enable"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};