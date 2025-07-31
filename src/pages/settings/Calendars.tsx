import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';
export const Calendars = () => {
  const [addingEvents, setAddingEvents] = useState(true);
  const [syncCalendar, setSyncCalendar] = useState(true);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const navigate = useNavigate();
  const handleAddCalendar = () => {
    navigate('/apps');
  };
  const handleRemoveApp = () => {
    setShowRemoveDialog(false);
  };
  useEffect(() => {
    setHeaderMeta({
      title: 'Calendars',
      description: 'Configure how your event types interact with your calendars.',
    });
  }, [setHeaderMeta]);
  return <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className='w-full flex justify-end mb-4'>
            <Button onClick={handleAddCalendar}>
              <Plus className="h-4 w-4"/>
              Add Calendar
            </Button>
        </div>
        <div className='space-y-2'>
          {/* Add to calendar */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Add to calendar</h2>
              <p className="text-muted-foreground">Select where to add events when you're booked.</p>
              
              <div className="space-y-2">
                <Label>Add events to</Label>
                <Select defaultValue="google-sanskar">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-sanskar">sanskarix@gmail.com (Google - sanskarix@gmail.com)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  You can override this on a per-event basis in Advanced settings in each event type.
                </p>
              </div>
            </div>
          </div>
          {/* Check for conflicts */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Check for conflicts</h2>
                  <Button onClick={handleAddCalendar}>
                    <Plus className="h-4 w-4"/>
                    Add
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Select which calendars you want to check for conflicts to prevent double bookings.
                </p>

                <div className="border rounded-lg p-6 bg-muted/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">31</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Google Calendar</h3>
                      <p className="text-sm text-muted-foreground">sanskarix@gmail.com</p>
                    </div>
                    <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Remove App</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Are you sure you want to remove this app?
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
                              Close
                            </Button>
                            <Button onClick={handleRemoveApp} className="bg-red-600 hover:bg-red-700">
                              Yes, remove app
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Toggle the calendars you want to check for conflicts to prevent double bookings.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch checked={addingEvents} onCheckedChange={setAddingEvents} />
                        <span className="text-sm">sanskarix@gmail.com</span>
                      </div>
                      <span className="text-sm text-muted-foreground">← Adding events to</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={syncCalendar} onCheckedChange={setSyncCalendar} />
                        <span className="text-sm">Sync this Google Calendar to display external bookings made outside Cal ID.</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={false} />
                        <span className="text-sm text-muted-foreground">Holidays in India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};