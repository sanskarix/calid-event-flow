import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Eye,
  XCircle
} from 'lucide-react';
import { HeaderMeta } from '@/components/Layout';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Mock data
const bookingTrendsData = [
  {
    week: 'Week 1',
    created: 145,
    completed: 128,
    rescheduled: 12,
    canceled: 8,
    noShowHost: 3,
    noShowGuest: 5
  },
  {
    week: 'Week 2',
    created: 168,
    completed: 149,
    rescheduled: 15,
    canceled: 10,
    noShowHost: 4,
    noShowGuest: 7
  },
  {
    week: 'Week 3',
    created: 152,
    completed: 135,
    rescheduled: 11,
    canceled: 6,
    noShowHost: 2,
    noShowGuest: 4
  },
  {
    week: 'Week 4',
    created: 189,
    completed: 167,
    rescheduled: 18,
    canceled: 12,
    noShowHost: 5,
    noShowGuest: 8
  },
];

const workflowTrendsData = [
  { week: 'Week 1', sent: 1250, read: 980, failed: 45, total: 1295 },
  { week: 'Week 2', sent: 1340, read: 1050, failed: 52, total: 1392 },
  { week: 'Week 3', sent: 1180, read: 920, failed: 38, total: 1218 },
  { week: 'Week 4', sent: 1420, read: 1110, failed: 65, total: 1485 },
];

const totalBookingsData = [
  { day: 'Mon', bookings: 24 },
  { day: 'Tue', bookings: 28 },
  { day: 'Wed', bookings: 32 },
  { day: 'Thu', bookings: 29 },
  { day: 'Fri', bookings: 35 },
  { day: 'Sat', bookings: 12 },
  { day: 'Sun', bookings: 8 },
];

const popularTimesData = [
  { hour: '9AM', bookings: 12 },
  { hour: '10AM', bookings: 18 },
  { hour: '11AM', bookings: 25 },
  { hour: '2PM', bookings: 22 },
  { hour: '3PM', bookings: 19 },
  { hour: '4PM', bookings: 15 },
];

const routingResponsesData = [
  { name: 'John Smith', email: 'john@example.com', city: 'San Francisco', role: 'Product Manager', bookingStatus: 'Accepted', submittedOn: '2024-01-15' },
  { name: 'Sarah Jones', email: 'sarah@example.com', city: 'New York', role: 'Designer', bookingStatus: 'Pending', submittedOn: '2024-01-14' },
  { name: 'Mike Brown', email: 'mike@example.com', city: 'Austin', role: 'Developer', bookingStatus: 'Canceled', submittedOn: '2024-01-13' },
  { name: 'Lisa Wilson', email: 'lisa@example.com', city: 'Seattle', role: 'Marketing Manager', bookingStatus: 'Accepted', submittedOn: '2024-01-12' },
];

const workflowMessages = [
  { workflow: 'Welcome Email', usage: 340, percentage: '28%' },
  { workflow: 'Reminder SMS', usage: 280, percentage: '23%' },
  { workflow: 'Follow-up WhatsApp', usage: 245, percentage: '20%' },
  { workflow: 'Confirmation Email', usage: 190, percentage: '16%' },
  { workflow: 'Cancellation Notice', usage: 160, percentage: '13%' },
];

export const Insights = () => {
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const [activeTab, setActiveTab] = useState('bookings');
  const [dateRange, setDateRange] = useState('7d');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [selectedAccount, setSelectedAccount] = useState('personal');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedBookingStatus, setSelectedBookingStatus] = useState('all');
  const [selectedWorkflowType, setSelectedWorkflowType] = useState('email');

  React.useEffect(() => {
    setHeaderMeta({
      title: 'Insights',
      description: 'Analytics and performance metrics for your scheduling activities',
    });
  }, [setHeaderMeta]);

  const MetricCard = ({ title, value, trend, icon: Icon, color = 'default' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend > 0 ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          {Math.abs(trend)}% from last period
        </div>
      </CardContent>
    </Card>
  );

  const handleExport = () => {
    toast.success('File downloaded successfully!');
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings' },
    { id: 'routings', label: 'Routings' },
    { id: 'workflows', label: 'Workflows' }
  ];

  return (
    <div className="space-y-6 pt-0 p-8">
      {/* Tab Navigation */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Account Selector and Filters Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="team1">Team 1</SelectItem>
                <SelectItem value="team2">Team 2</SelectItem>
              </SelectContent>
            </Select>

          {activeTab === 'bookings' && (
            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Event Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                <SelectItem value="sales-demo">Sales Demo</SelectItem>
                <SelectItem value="discovery-call">Discovery Call</SelectItem>
                <SelectItem value="technical-interview">Technical Interview</SelectItem>
                <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
              </SelectContent>
            </Select>
          )}
          {activeTab === 'routings' && (
            <>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  <SelectItem value="sales-qualification">Sales Qualification</SelectItem>
                  <SelectItem value="technical-assessment">Technical Assessment</SelectItem>
                  <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBookingStatus} onValueChange={setSelectedBookingStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="awaiting-host">Awaiting host</SelectItem>
                  <SelectItem value="no-booking">No booking</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          {activeTab === 'workflows' && (
            <Select value={selectedWorkflowType} onValueChange={setSelectedWorkflowType}>
              <SelectTrigger className="w-[150px]">
    
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    SMS
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          </div>

          {/* Time Selector and Export */}
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={(value) => {
              setDateRange(value);
              setShowCustomDate(value === 'custom');
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {showCustomDate && (
              <DatePickerWithRange
                className="w-auto"
                value={customDateRange}
                onChange={setCustomDateRange}
              />
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Bookings"
                value="168"
                trend={12.3}
                icon={Calendar}
              />
              <MetricCard
                title="Events Rescheduled"
                value="23"
                trend={-5.2}
                icon={Clock}
              />
              <MetricCard
                title="Events Canceled"
                value="12"
                trend={8.1}
                icon={XCircle}
              />
              <MetricCard
                title="Avg Meeting Duration"
                value="28 min"
                trend={3.2}
                icon={Clock}
              />
            </div>

            {/* Booking Trends Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={bookingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-lg">
                              <p className="text-sm font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-muted-foreground">{entry.dataKey}:</span>
                                  <span className="font-medium">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Created"
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="Completed"
                      dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rescheduled"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={3}
                      name="Rescheduled"
                      dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="canceled"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      name="Canceled"
                      dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="noShowHost"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={3}
                      name="No Show (Host)"
                      dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-4))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="noShowGuest"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={3}
                      name="No Show (Guest)"
                      dot={{ fill: "hsl(var(--chart-5))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-5))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>



            {/* Top Performing Meeting Types */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Meeting Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sales Demo', bookings: 45, conversion: '82%' },
                    { name: 'Discovery Call', bookings: 38, conversion: '76%' },
                    { name: 'Technical Interview', bookings: 32, conversion: '68%' },
                    { name: 'Follow-up Meeting', bookings: 28, conversion: '91%' },
                  ].map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.bookings} bookings</p>
                      </div>
                      <Badge variant="secondary">{type.conversion}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'routings' && (
          <div className="space-y-6">
            {/* Response Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Total Responses"
                value="1,250"
                trend={8.2}
                icon={Target}
              />
              <MetricCard
                title="Responses With Booking"
                value="840"
                trend={12.5}
                icon={CheckCircle}
              />
              <MetricCard
                title="Responses Without Booking"
                value="410"
                trend={-3.1}
                icon={XCircle}
              />
            </div>

            {/* Responses Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booked By</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Booking Status</TableHead>
                      <TableHead>Submitted On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routingResponsesData.map((response, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell className="font-medium">{response.name}</TableCell>
                        <TableCell>{response.email}</TableCell>
                        <TableCell>{response.city}</TableCell>
                        <TableCell>{response.role}</TableCell>
                        <TableCell>
                          <Badge variant={response.bookingStatus === 'Accepted' ? 'default' : 'secondary'}>
                            {response.bookingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{response.submittedOn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard
                title="Total Messages Triggered"
                value="4,280"
                trend={12.3}
                icon={Target}
              />
              <MetricCard
                title="Messages Sent"
                value="4,105"
                trend={10.1}
                icon={Send}
              />
              <MetricCard
                title="Messages Read"
                value="3,204"
                trend={8.5}
                icon={Eye}
              />
              <MetricCard
                title="Messages Failed"
                value="175"
                trend={-15.2}
                icon={XCircle}
              />
            </div>

            {/* Workflow Trends Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={workflowTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-lg">
                              <p className="text-sm font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-muted-foreground">{entry.dataKey}:</span>
                                  <span className="font-medium">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Total"
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="Sent"
                      dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="read"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={3}
                      name="Read"
                      dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="failed"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      name="Failed"
                      dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Most Used Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowMessages.map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {selectedWorkflowType === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
                        {selectedWorkflowType === 'sms' && <Phone className="h-5 w-5 text-green-500" />}
                        {selectedWorkflowType === 'whatsapp' && <MessageSquare className="h-5 w-5 text-green-600" />}
                        <div>
                          <h4 className="font-medium">{workflow.workflow}</h4>
                          <p className="text-sm text-muted-foreground">{workflow.usage} messages</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{workflow.percentage}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
