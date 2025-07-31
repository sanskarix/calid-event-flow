
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Switch } from './ui/switch';

export const RecurringEvent = () => {
  const [isRecurringEnabled, setIsRecurringEnabled] = useState(false);

  return (
    <div className="p-0 max-w-none mx-auto space-y-6" style={{ fontSize: '14px', color: '#384252' }}>
      <div className="space-y-6">
        {/* Warning */}
        <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p style={{ fontSize: '14px', color: '#384252' }}>
              <strong>Experimental:</strong> Recurring Events are currently experimental. We are working on it.
            </p>
          </div>
        </div>

        {/* Recurring Event Card */}
        {/* <div className="border border-border rounded-lg p-4 bg-card">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch id="enable-recurring" checked={isRecurringEnabled} onCheckedChange={setIsRecurringEnabled} />
              <label htmlFor="enable-recurring" className="font-medium" style={{ fontSize: '14px', color: '#384252' }}>
                Enable Recurring Events
              </label>
            </div>
            
            {isRecurringEnabled && (
              <div className="space-y-4 pl-6 border-l-2 border-muted animate-fade-in">
                <div>
                  <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#384252' }}>Frequency</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background" style={{ fontSize: '14px', color: '#384252' }}>
                    <option>Does not repeat</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-medium mb-2" style={{ fontSize: '14px', color: '#384252' }}>End date</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="never" name="endType" className="rounded" defaultChecked />
                      <label htmlFor="never" style={{ fontSize: '14px', color: '#384252' }}>Never</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="date" name="endType" className="rounded" />
                      <label htmlFor="date" style={{ fontSize: '14px', color: '#384252' }}>On date</label>
                      <input type="date" className="ml-2 px-2 py-1 border border-border rounded bg-background" style={{ fontSize: '14px' }} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="occurrences" name="endType" className="rounded" />
                      <label htmlFor="occurrences" style={{ fontSize: '14px', color: '#384252' }}>After</label>
                      <input type="number" className="w-16 ml-2 px-2 py-1 border border-border rounded bg-background" placeholder="1" style={{ fontSize: '14px' }} />
                      <span style={{ fontSize: '14px', color: '#384252' }}>occurrences</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};
