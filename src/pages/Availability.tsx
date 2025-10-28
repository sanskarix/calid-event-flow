
import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Copy, Trash2, Star, Earth, EarthIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BulkUpdateModal } from '../components/BulkUpdateModal';
import { TeamAvailability } from '../components/TeamAvailability';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';

interface Schedule {
  id: string;
  title: string;
  description: string;
  hours: string;
  timezone: string;
  isDefault: boolean;
}

export const Availability = () => {
  const [selectedTab, setSelectedTab] = useState('my-availability');
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');
  const navigate = useNavigate();
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  useEffect(() => {
    setHeaderMeta({
      title: 'Availability',
      description: 'View and manage all your scheduled appointments.'
    });
  }, [setHeaderMeta]);
  
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 'working-hours',
      title: 'Working Hours',
      description: 'Default',
      hours: 'Mon - Fri, 9:00 AM - 5:00 PM',
      timezone: 'Asia/Calcutta',
      isDefault: true
    },
    {
      id: 'additional-hours',
      title: 'Additional hours',
      description: '',
      hours: 'Mon - Fri, 9:00 AM - 5:00 PM\nSun, Sat, 9:00 AM - 4:00 PM',
      timezone: 'Asia/Calcutta',
      isDefault: false
    }
  ]);

  const handleScheduleClick = (scheduleId: string) => {
    navigate(`/availability/${scheduleId}`);
  };

  const handleSetAsDefault = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => ({
      ...schedule,
      isDefault: schedule.id === scheduleId
    })));
    setShowMoreOptions(null);
    setIsBulkUpdateModalOpen(true);
  };

  const handleDuplicate = (scheduleId: string) => {
    const originalSchedule = schedules.find(s => s.id === scheduleId);
    if (originalSchedule) {
      const newSchedule = {
        ...originalSchedule,
        id: `${scheduleId}-copy-${Date.now()}`,
        title: `${originalSchedule.title} (Copy)`,
        isDefault: false
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    setShowMoreOptions(null);
  };

  const handleDelete = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    setShowMoreOptions(null);
  };

  const handleMenuAction = (action: string, scheduleId: string) => {
    switch (action) {
      case 'setDefault':
        handleSetAsDefault(scheduleId);
        break;
      case 'duplicate':
        handleDuplicate(scheduleId);
        break;
      case 'delete':
        handleDelete(scheduleId);
        break;
    }
  };

  const handleNewSchedule = () => {
    if (newScheduleName.trim()) {
      const newId = `schedule-${Date.now()}`;
      navigate(`/availability/${newId}`, {
        state: {
          newScheduleName: newScheduleName.trim()
        }
      });
      setIsNewScheduleModalOpen(false);
      setNewScheduleName('');
    }
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  const tabs = [
    { id: 'my-availability', label: 'My Availability' },
    { id: 'team-availability', label: 'Team Availability' }
  ];

  return (
    <div className="px-8 pt-0 pb-6 space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between mb-6">
        {/* Custom Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === 'my-availability' && (
          <Button
            onClick={() => setIsNewScheduleModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New schedule
          </Button>
        )}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {selectedTab === 'my-availability' && (
          <div className="grid gap-4">
            {sortedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-card rounded-lg border border-border hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleScheduleClick(schedule.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-foreground text-lg">
                          {schedule.title}
                        </h3>
                        {schedule.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded border font-medium border-green-600 text-green-600 bg-transparent">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        {schedule.hours.split('\n').map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2"><EarthIcon className="h-4 w-4" /></span>
                        <span>{schedule.timezone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setShowMoreOptions(showMoreOptions === schedule.id ? null : schedule.id)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {showMoreOptions === schedule.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg animate-scale-in z-10">
                            <div className="py-1">
                              {!schedule.isDefault && (
                                <button
                                  onClick={() => handleMenuAction('setDefault', schedule.id)}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                                  Set as default
                                </button>
                              )}
                              <button
                                onClick={() => handleMenuAction('duplicate', schedule.id)}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                              >
                                <Copy className="h-4 w-4 mr-2 text-muted-foreground" />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleMenuAction('delete', schedule.id)}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'team-availability' && (
          <TeamAvailability />
        )}
      </div>

      {/* New Schedule Modal */}
      <Dialog open={isNewScheduleModalOpen} onOpenChange={setIsNewScheduleModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a new schedule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="schedule-name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="schedule-name"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                placeholder="Working Hours"
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsNewScheduleModalOpen(false)}>
                Close
              </Button>
              <Button onClick={handleNewSchedule} disabled={!newScheduleName.trim()}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={isBulkUpdateModalOpen}
        onClose={() => setIsBulkUpdateModalOpen(false)}
        onUpdate={(selectedEventTypes) => {
          console.log('Bulk updating event types:', selectedEventTypes);
          setIsBulkUpdateModalOpen(false);
        }}
      />
    </div>
  );
};
