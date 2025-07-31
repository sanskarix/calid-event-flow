
import React, { useState } from 'react';
import { Clock2, Earth, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from './ui/custom-select';

export const EventAvailability = () => {
  const navigate = useNavigate();
  const [selectedSchedule, setSelectedSchedule] = useState('default');

  const handleEditAvailability = () => {
    navigate('/availability');
  };

  const scheduleOptions = [
    { value: 'default', label: 'Working Hours - Default' },
    { value: 'weekend', label: 'Weekend Schedule' },
    { value: 'holiday', label: 'Holiday Schedule' }
  ];

  const weeklySchedule = [
    { day: 'Monday', startTime: '9:00 am', endTime: '5:00 pm', available: true },
    { day: 'Tuesday', startTime: '9:00 am', endTime: '5:00 pm', available: true },
    { day: 'Wednesday', startTime: '9:00 am', endTime: '5:00 pm', available: true },
    { day: 'Thursday', startTime: '9:00 am', endTime: '5:00 pm', available: true },
    { day: 'Friday', startTime: '9:00 am', endTime: '5:00 pm', available: true },
    { day: 'Saturday', startTime: '', endTime: '', available: false },
    { day: 'Sunday', startTime: '', endTime: '', available: false }
  ];

  return (
    <div className="p-6 max-w-none mx-auto space-y-6 border border-gray-200 rounded-lg" style={{ fontSize: '14px', color: '#384252' }}>
      {/* Header with dropdown */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-2 flex-1">
          <CustomSelect
            value={selectedSchedule}
            onValueChange={setSelectedSchedule}
            options={scheduleOptions}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-6">
        {weeklySchedule.map((schedule, index) => (
          <div key={schedule.day} className="flex items-center justify-between">
            <div className="font-medium min-w-[120px]" style={{ fontSize: '14px', color: '#384252' }}>
              {schedule.day}
            </div>
            <div className="flex items-center space-x-4" style={{ fontSize: '14px', color: '#384252' }}>
              {schedule.available ? (
                <>
                  <span>{schedule.startTime}</span>
                  <span>-</span>
                  <span>{schedule.endTime}</span>
                </>
              ) : (
                <span>Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timezone section */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          <Earth className='w-4 h-4'></Earth>
          <span style={{ fontSize: '14px', color: '#384252' }}>Asia/Calcutta</span>
        </div>
        <button
          onClick={handleEditAvailability}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          style={{ fontSize: '14px' }}
        >
          <Clock2 className="h-4 w-4" />
          <span>Edit Availability</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
