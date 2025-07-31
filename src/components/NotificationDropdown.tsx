
import React from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;  
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = (type: 'unconfirmed' | 'upcoming') => {
    navigate(`/bookings?tab=${type}`);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-1 w-80 bg-background border border-border rounded-lg shadow-lg animate-scale-in z-10">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Notifications</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div 
            className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => handleNotificationClick('unconfirmed')}
          >
            <p className="text-sm text-foreground font-medium">New booking received</p>
            <p className="text-xs text-muted-foreground mt-1">Product Hunt Chat - 2 hours ago</p>
          </div>
          <div 
            className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => handleNotificationClick('upcoming')}
          >
            <p className="text-sm text-foreground font-medium">Upcoming meeting</p>
            <p className="text-xs text-muted-foreground mt-1">Discovery Call in 1 hour - 30 minutes ago</p>
          </div>
          <div 
            className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => handleNotificationClick('upcoming')}
          >
            <p className="text-sm text-foreground font-medium">Reminder</p>
            <p className="text-xs text-muted-foreground mt-1">Strategy Session in 30 minutes - 6 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};
