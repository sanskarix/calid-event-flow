import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';
export const General = () => {
  const [dynamicGroupLinks, setDynamicGroupLinks] = useState(true);
  const [searchEngineIndexing, setSearchEngineIndexing] = useState(true);
  const [monthlyDigest, setMonthlyDigest] = useState(true);
  const [scheduleTimezoneOpen, setScheduleTimezoneOpen] = useState(false);
  const [noEndDate, setNoEndDate] = useState(false);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [travelSchedules, setTravelSchedules] = useState<Array<{
    id: string;
    dateRange: string;
    timezone: string;
  }>>([]);
  const handleAddTravelSchedule = () => {
    if (dateRange.from) {
      const newSchedule = {
        id: Date.now().toString(),
        dateRange: dateRange.to ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}` : format(dateRange.from, 'MMM dd, yyyy'),
        timezone: 'Asia/Dhaka'
      };
      setTravelSchedules([...travelSchedules, newSchedule]);
      setDateRange({});
      setScheduleTimezoneOpen(false);
    }
  };
  const handleDeleteTravelSchedule = (id: string) => {
    setTravelSchedules(travelSchedules.filter(schedule => schedule.id !== id));
  };

  useEffect(() => {
    setHeaderMeta({
      title: 'General',
      description: 'Manage settings for your language and timezone.',
    });
  }, [setHeaderMeta]);

  return <div className="min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="px-8  py-6 w-full">
        <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
        <div className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="english">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div className="space-y-4">
            <Label>Timezone</Label>
            <Select defaultValue="asia-kolkata">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-kolkata">Asia/Kolkata</SelectItem>
                <SelectItem value="america-new-york">America/New_York</SelectItem>
                <SelectItem value="europe-london">Europe/London</SelectItem>
              </SelectContent>
            </Select>

            {/* Travel Schedule Section */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Travel Schedule</h3>
                <Dialog open={scheduleTimezoneOpen} onOpenChange={setScheduleTimezoneOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Travel Schedule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Plan your trip ahead to keep your existing schedule in a different timezone and prevent being booked at midnight.
                      </p>
                      
                      <div className="space-y-2">
                        <Label>Time range</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? dateRange.to ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}` : format(dateRange.from, 'MMM dd, yyyy') : 'Jul 11, 2025 - Jul 11, 2025'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="range" selected={dateRange.from && dateRange.to ? {
                            from: dateRange.from,
                            to: dateRange.to
                          } : undefined} onSelect={range => setDateRange(range || {})} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Schedule timezone without end date</Label>
                        <Switch checked={noEndDate} onCheckedChange={setNoEndDate} />
                      </div>

                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select defaultValue="asia-dhaka">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asia-dhaka">Asia/Dhaka</SelectItem>
                            <SelectItem value="asia-kolkata">Asia/Kolkata</SelectItem>
                            <SelectItem value="america-new-york">America/New_York</SelectItem>
                            <SelectItem value="europe-london">Europe/London</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setScheduleTimezoneOpen(false)} className="hover:scale-105 transition-transform duration-200">
                          Close
                        </Button>
                        <Button onClick={handleAddTravelSchedule} className="hover:scale-105 transition-transform duration-200">
                          Add
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Display existing travel schedules */}
              {travelSchedules.map(schedule => <div key={schedule.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div>
                    <div className="font-medium">{schedule.dateRange}</div>
                    <div className="text-sm text-muted-foreground">{schedule.timezone}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTravelSchedule(schedule.id)} className="hover:scale-105 transition-transform duration-200">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>)}
            </div>
          </div>

          {/* Time format */}
          <div className="space-y-2">
            <Label>Time format</Label>
            <Select defaultValue="12-hour">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12-hour">12 hour</SelectItem>
                <SelectItem value="24-hour">24 hour</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This is an internal setting and will not affect how times are displayed on public booking pages for you or anyone booking you.
            </p>
          </div>

          {/* Start of week */}
          <div className="space-y-2">
            <Label>Start of week</Label>
            <Select defaultValue="monday">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Settings toggles - Separated section */}
          <div className="pt-8 border-t space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dynamic group links</h3>
                <p className="text-sm text-muted-foreground">Allow attendees to book you through dynamic group bookings</p>
              </div>
              <Switch checked={dynamicGroupLinks} onCheckedChange={setDynamicGroupLinks} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Allow search engine indexing</h3>
                <p className="text-sm text-muted-foreground">Allow search engines to access your public content</p>
              </div>
              <Switch checked={searchEngineIndexing} onCheckedChange={setSearchEngineIndexing} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Monthly digest email</h3>
                <p className="text-sm text-muted-foreground">Monthly digest email for teams</p>
              </div>
              <Switch checked={monthlyDigest} onCheckedChange={setMonthlyDigest} />
            </div>
          </div>

          {/* Update button */}
          
        </div>
        </div>
      </div>
    </div>;
};
