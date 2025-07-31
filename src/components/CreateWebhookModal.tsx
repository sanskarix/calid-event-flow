import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Switch } from './ui/switch';
import { CustomSelect } from './ui/custom-select';

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWebhook: (data: any) => void;
  editingWebhook?: any;
}

export const CreateWebhookModal: React.FC<CreateWebhookModalProps> = ({
  isOpen,
  onClose,
  onCreateWebhook,
  editingWebhook
}) => {
  const [formData, setFormData] = useState({
    subscriberUrl: '',
    eventTriggers: [] as string[],
    eventTriggersInput: '',
    showEventTriggerDropdown: false,
    payloadTemplate: 'default',
    customPayload: '',
    enableWebhook: true,
    secret: '',
    noShowDuration: '24',
    noShowUnit: 'mins',
    testResponse: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableEventTriggers = [
    'Booking Canceled',
    'Booking Created',
    'Booking Rejected',
    'Booking Requested',
    'Booking Payment Initiated',
    'Booking Rescheduled',
    'Booking Paid',
    'Booking No-Show Updated',
    'Meeting Ended',
    'Meeting Started',
    'Recording Download Link Ready',
    'Out of Office Created',
    'Transcript Generated',
    'After hosts didn\'t join cal video',
    'After guests didn\'t join cal video'
  ];

  useEffect(() => {
    if (editingWebhook) {
      setFormData({
        subscriberUrl: editingWebhook.url,
        eventTriggers: editingWebhook.events,
        eventTriggersInput: '',
        showEventTriggerDropdown: false,
        payloadTemplate: 'default',
        customPayload: '',
        enableWebhook: editingWebhook.active,
        secret: '',
        noShowDuration: '24',
        noShowUnit: 'mins',
        testResponse: ''
      });
    } else {
      setFormData({
        subscriberUrl: '',
        eventTriggers: availableEventTriggers,
        eventTriggersInput: '',
        showEventTriggerDropdown: false,
        payloadTemplate: 'default',
        customPayload: '',
        enableWebhook: true,
        secret: '',
        noShowDuration: '24',
        noShowUnit: 'mins',
        testResponse: ''
      });
    }
  }, [editingWebhook, isOpen]);

  const addEventTrigger = (trigger: string) => {
    if (trigger && !formData.eventTriggers.includes(trigger)) {
      setFormData(prev => ({
        ...prev,
        eventTriggers: [...prev.eventTriggers, trigger],
        showEventTriggerDropdown: false
      }));
    }
  };

  const removeEventTrigger = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      eventTriggers: prev.eventTriggers.filter(t => t !== trigger)
    }));
  };

  const getAvailableTriggers = () => {
    return availableEventTriggers.filter(trigger =>
      !formData.eventTriggers.includes(trigger) &&
      trigger.toLowerCase().includes(formData.eventTriggersInput.toLowerCase())
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFormData(prev => ({ ...prev, showEventTriggerDropdown: false }));
      }
    };

    if (formData.showEventTriggerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formData.showEventTriggerDropdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWebhook(formData);
    onClose();
  };

  const handlePingTest = () => {
    setFormData(prev => ({
      ...prev,
      testResponse: 'No data yet'
    }));
  };

  const clearAllEventTriggers = () => {
    setFormData(prev => ({
      ...prev,
      eventTriggers: []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingWebhook ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
          <DialogDescription>
            {editingWebhook ? 'Update this webhook configuration.' : 'Create a new webhook for this event type.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === URL === */}
          <div>
            <label className="block text-sm font-medium mb-2">Subscriber URL</label>
            <input
              type="url"
              value={formData.subscriberUrl}
              onChange={e => setFormData(prev => ({ ...prev, subscriberUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* === Enable Webhook === */}
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-webhook"
              checked={formData.enableWebhook}
              onCheckedChange={checked => setFormData(prev => ({ ...prev, enableWebhook: checked }))}
            />
            <label htmlFor="enable-webhook" className="text-sm font-medium">Enable Webhook</label>
          </div>

          {/* === Event Triggers === */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Triggers</label>
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-full min-h-[40px] px-3 py-2 border border-border rounded-lg focus-within:ring-2 focus-within:ring-ring bg-background cursor-text flex flex-wrap items-center gap-2"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    showEventTriggerDropdown: !prev.showEventTriggerDropdown,
                  }))
                }
              >
                {formData.eventTriggers.map(trigger => (
                  <span
                    key={trigger}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded border"
                  >
                    {trigger}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        removeEventTrigger(trigger);
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {formData.eventTriggers.length === 0 && (
                  <span className="text-gray-400 text-sm">Search event triggers...</span>
                )}

                <div className="ml-auto flex items-center gap-2">
                  {formData.eventTriggers.length > 0 && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        clearAllEventTriggers();
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {formData.showEventTriggerDropdown ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                  )}
                </div>
              </div>
              {formData.showEventTriggerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                  {getAvailableTriggers().map(trigger => (
                    <button
                      key={trigger}
                      type="button"
                      onClick={() => addEventTrigger(trigger)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      {trigger}
                    </button>
                  ))}
                  {getAvailableTriggers().length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">No more triggers available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* === No-show timing === */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Time after no-show on Cal video meeting
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.noShowDuration}
                onChange={e => setFormData(prev => ({ ...prev, noShowDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
              <CustomSelect
                value={formData.noShowUnit}
                onValueChange={value => setFormData(prev => ({ ...prev, noShowUnit: value }))}
                className="w-full"
                options={[
                  { value: 'mins', label: 'mins' },
                  { value: 'hours', label: 'hours' }
                ]}
              />
            </div>
          </div>

          {/* === Secret === */}
          <div>
            <label className="block text-sm font-medium mb-2">Secret</label>
            <input
              type="password"
              value={formData.secret}
              onChange={e => setFormData(prev => ({ ...prev, secret: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* === Payload Template === */}
          <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payload Template</label>
            <div className="flex gap-2">
              {['default', 'custom'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, payloadTemplate: option }))}
                  className={`w-full px-4 py-2 border rounded-lg text-sm ${
                    formData.payloadTemplate === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            {formData.payloadTemplate === 'custom' && (
              <textarea
                value={formData.customPayload}
                onChange={e => setFormData(prev => ({ ...prev, customPayload: e.target.value }))}
                placeholder="Enter your custom payload template..."
                rows={6}
                className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            )}
          </div>

          {/* === Webhook Test === */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-sm  text-gray-700">Webhook Test</h3>
                <p className="text-sm text-gray-600">Ping before creating</p>
              </div>
              <button
                type="button"
                onClick={handlePingTest}
                disabled={!formData.subscriberUrl.trim()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                <Activity className="h-4 w-4 mr-2" />
                Ping Test
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Response</label>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] text-sm text-gray-600">
                {formData.testResponse || 'No data yet'}
              </div>
            </div>
          </div>

          {/* === Footer Buttons === */}
          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
