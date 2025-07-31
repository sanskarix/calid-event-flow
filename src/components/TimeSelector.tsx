
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export const TimeSelector = ({ value, onChange, placeholder = "Select time" }: TimeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate time slots in 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeString);
        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'pm' : 'am';
    return `${hour12}:${minutes}${ampm}`;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  const displayValue = value ? formatTime(value) : placeholder;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
            {displayValue}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => handleTimeSelect(slot.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors ${
                  value === slot.value ? 'bg-muted text-primary font-medium' : 'text-foreground'
                }`}
              >
                {slot.display}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </>
  );
};
