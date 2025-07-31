import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

interface AppSettingsModalProps {
  app: {
    id: string;
    name: string;
    description: string;
    logo: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const appTemplates = {
  zapier: [
    { name: 'Send emails via Gmail for scheduled events', description: 'Gmail', url: 'https://zapier.com/apps/gmail/integrations', buttonText: 'Use Zap' },
    { name: 'Create Google Sheets rows for scheduled events', description: 'Google Sheets', url: 'https://zapier.com/apps/google-sheets/integrations', buttonText: 'Use Zap' },
    { name: 'Create Salesforce leads from new bookings', description: 'Salesforce', url: 'https://zapier.com/apps/salesforce/integrations', buttonText: 'Use Zap' },
    { name: 'Create Todoist tasks for scheduled events', description: 'Todoist', url: 'https://zapier.com/apps/todoist/integrations', buttonText: 'Use Zap' },
    { name: 'Send emails via Gmail for rescheduled events', description: 'Gmail', url: 'https://zapier.com/apps/gmail/integrations', buttonText: 'Use Zap' },
    { name: 'Send emails via Gmail for cancelled events', description: 'Gmail', url: 'https://zapier.com/apps/gmail/integrations', buttonText: 'Use Zap' },
    { name: 'Send emails via Gmail after scheduled meetings end', description: 'Gmail', url: 'https://zapier.com/apps/gmail/integrations', buttonText: 'Use Zap' },
    { name: 'Add new bookings to Google Calendar', description: 'Google Calendar', url: 'https://zapier.com/apps/google-calendar/integrations', buttonText: 'Use Zap' },
  ],
  plausible: [
    { name: 'Analytics Dashboard', description: 'View your site analytics', url: 'https://plausible.io/dashboard', buttonText: 'Open Dashboard' },
    { name: 'Custom Events', description: 'Track custom events', url: 'https://plausible.io/docs/custom-events', buttonText: 'Learn More' },
    { name: 'Goal Tracking', description: 'Set up conversion goals', url: 'https://plausible.io/docs/goal-conversions', buttonText: 'Setup Goals' },
  ],
  'google-analytics': [
    { name: 'GA4 Setup', description: 'Configure Google Analytics 4', url: 'https://analytics.google.com/analytics/web/', buttonText: 'Open GA4' },
    { name: 'Conversion Tracking', description: 'Track conversions', url: 'https://support.google.com/analytics/answer/1032415', buttonText: 'Setup Tracking' },
    { name: 'Custom Reports', description: 'Create custom reports', url: 'https://support.google.com/analytics/answer/1151300', buttonText: 'Create Report' },
  ],
  default: [
    { name: 'Getting Started Guide', description: 'Learn the basics', url: '#', buttonText: 'Get Started' },
    { name: 'Integration Templates', description: 'Pre-built templates', url: '#', buttonText: 'Browse Templates' },
    { name: 'Best Practices', description: 'Optimization tips', url: '#', buttonText: 'Learn More' },
  ],
};

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  app,
  isOpen,
  onClose,
}) => {
  if (!app) {
    return null;
  }

  const templates = appTemplates[app.id] || appTemplates.default;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Get started with {app.name} templates</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-3 mt-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{app.logo}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{template.name}</span>
                  <span className="text-sm text-muted-foreground">{template.description}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(template.url, '_blank')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {template.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
