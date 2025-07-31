
import React, { useState } from 'react';
import { Plus, Webhook, Trash2, Edit } from 'lucide-react';
import { Switch } from './ui/switch';
import { CreateWebhookModal } from './CreateWebhookModal';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

export const EventWebhooks = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);

  const handleCreateWebhook = (webhookData: any) => {
    if (editingWebhook) {
      // Update existing webhook
      setWebhooks(prev => prev.map(w => 
        w.id === editingWebhook.id 
          ? {
              ...w,
              url: webhookData.subscriberUrl,
              events: webhookData.eventTriggers,
              active: webhookData.enableWebhook
            }
          : w
      ));
      setEditingWebhook(null);
    } else {
      // Create new webhook
      const webhook: WebhookConfig = {
        id: Date.now().toString(),
        name: `Webhook ${webhooks.length + 1}`,
        url: webhookData.subscriberUrl,
        events: webhookData.eventTriggers,
        active: webhookData.enableWebhook
      };
      setWebhooks(prev => [...prev, webhook]);
    }
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const editWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingWebhook(null);
  };

  return (
    <div className="p-0 max-w-none mx-auto space-y-6">
      {webhooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Webhook className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium mb-4">No webhooks configured</p>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="px-4 py-2 bg-primary text-white rounded-lg  hover:bg-primary/90 font-medium" 
            style={{ fontSize: '14px' }}
          >
            Create Webhook
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Configured Webhooks</h3>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium text-sm" 
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Webhook
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.map(webhook => (
              <div 
                key={webhook.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  webhook.active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
                style={webhook.active ? {
                  borderColor: 'rgba(0, 140, 68, 0.3)',
                  backgroundColor: 'rgba(0, 140, 68, 0.05)'
                } : {}}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      webhook.active ? 'bg-green-100' : 'bg-blue-100'
                    }`}
                    style={webhook.active ? {
                      backgroundColor: 'rgba(0, 140, 68, 0.1)'
                    } : {}}>
                      <Webhook className={`h-4 w-4 ${
                        webhook.active ? 'text-green-600' : 'text-blue-600'
                      }`} 
                      style={webhook.active ? {
                        color: '#008c44'
                      } : {}} />
                    </div>
                    <div>
                      <h4 className="font-medium" style={{ fontSize: '14px', color: '#384252' }}>
                        {webhook.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#384252' }}>{webhook.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={webhook.active}
                      onCheckedChange={() => toggleWebhook(webhook.id)}
                    />
                    <button
                      onClick={() => editWebhook(webhook)}
                      className="p-1 text-sm text-blue-600 hover:bg-gray-200 rounded font-medium transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteWebhook(webhook.id)}
                      className="p-1 hover:bg-gray-200 rounded text-red-500 hover:text-red-700"
                      title="Delete webhook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 relative">
                  {webhook.events.slice(0, 3).map(event => (
                    <span 
                      key={event} 
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full" 
                      style={{ fontSize: '12px' }}
                    >
                      {event}
                    </span>
                  ))}
                  {webhook.events.length > 3 && (
                    <div className="relative">
                      <span 
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full cursor-help" 
                        style={{ fontSize: '12px' }}
                      >
                        +{webhook.events.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p style={{ fontSize: '14px', color: '#384252' }}>
              If you wish to edit or manage your webhooks, please head over to{' '}
              <a href="/settings/webhooks" className="text-blue-600 hover:text-blue-700 underline">
                webhook settings
              </a>
            </p>
          </div>
        </div>
      )}

      <CreateWebhookModal 
        isOpen={showCreateModal} 
        onClose={closeModal} 
        onCreateWebhook={handleCreateWebhook}
        editingWebhook={editingWebhook}
      />
    </div>
  );
};
