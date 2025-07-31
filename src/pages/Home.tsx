
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Plus, 
  Calendar as CalendarIcon,
  Smartphone,
  Route,
  Workflow,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const mockBookingData = [
  { date: '2024-01-01', bookings: 12 },
  { date: '2024-01-02', bookings: 19 },
  { date: '2024-01-03', bookings: 8 },
  { date: '2024-01-04', bookings: 15 },
  { date: '2024-01-05', bookings: 22 },
  { date: '2024-01-06', bookings: 18 },
  { date: '2024-01-07', bookings: 25 },
  { date: '2024-01-08', bookings: 14 },
  { date: '2024-01-09', bookings: 16 },
  { date: '2024-01-10', bookings: 20 },
  { date: '2024-01-11', bookings: 24 },
  { date: '2024-01-12', bookings: 17 },
  { date: '2024-01-13', bookings: 21 },
  { date: '2024-01-14', bookings: 19 },
  { date: '2024-01-15', bookings: 23 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--primary))",
  },
};

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Create Event Type',
      icon: Plus,
      description: 'Create a new event type',
      onClick: () => navigate('/event-types')
    },
    {
      label: 'New Booking',
      icon: CalendarIcon,
      description: 'Schedule a new booking',
      onClick: () => navigate('/bookings')
    },
    {
      label: 'Install App',
      icon: Smartphone,
      description: 'Install calendar app',
      onClick: () => navigate('/apps')
    },
    {
      label: 'New Routing Form',
      icon: Route,
      description: 'Create a routing form',
      onClick: () => navigate('/routing-forms')
    },
    {
      label: 'New Workflow',
      icon: Workflow,
      description: 'Create a new workflow',
      onClick: () => navigate('/workflows')
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Hero Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings Card */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Bookings</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8</div>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">42</div>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">156</div>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">12</div>
                <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Overview Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bookings Trend
            </CardTitle>
            <CardDescription>Daily bookings over the past 15 days</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockBookingData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  className="text-sm"
                />
                <YAxis className="text-sm" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map((action, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent"
                      onClick={action.onClick}
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/insights')}
        >
          Need help? Visit Insights
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
