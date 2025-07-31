
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SchedulingComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <Calendar className="h-24 w-24 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Scheduling & Rescheduling</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our scheduling and rescheduling features are coming soon! We're working hard to bring you the best booking experience.
          </p>
        </div>
        <Button onClick={() => navigate('/bookings')}>
          Back to Bookings
        </Button>
      </div>
    </div>
  );
}
