import { useState, useEffect } from "react";
import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const timeSlots = [
  { time: "9:00 AM", label: "Morning standup" },
  { time: "10:30 AM", label: "Client call" },
  { time: "1:00 PM", label: "Team sync" },
  { time: "3:00 PM", label: "Review meeting" },
  { time: "4:30 PM", label: "1:1 with Alex" },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const calendarDays = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, null, null],
];

export const AnimatedCalendar = () => {
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState(15);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setBookedSlots((prev) => {
        if (prev.length >= timeSlots.length) {
          // Reset and change day
          setActiveDay((d) => (d >= 28 ? 15 : d + 1));
          return [];
        }
        return [...prev, prev.length];
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="relative w-full max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating elements */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/10 rounded-full animate-pulse" />
      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary/5 rounded-full animate-pulse delay-300" />
      
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">January 2026</span>
            </div>
            <div className="text-sm opacity-80">Your Schedule</div>
          </div>
        </div>

        {/* Mini calendar */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {weekDays.map((day, i) => (
              <div key={i} className="text-gray-400 font-medium py-1">
                {day}
              </div>
            ))}
            {calendarDays.flat().map((day, i) => (
              <div
                key={i}
                className={cn(
                  "py-1.5 rounded-md text-sm transition-all duration-300",
                  day === activeDay && "bg-primary text-white font-semibold scale-110",
                  day && day !== activeDay && "text-gray-600 hover:bg-gray-50",
                  !day && "text-transparent"
                )}
              >
                {day || "."}
              </div>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="p-4 space-y-2">
          <div className="text-xs text-gray-500 font-medium mb-3">
            Available times for Jan {activeDay}
          </div>
          {timeSlots.map((slot, index) => {
            const isBooked = bookedSlots.includes(index);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all duration-500",
                  isBooked
                    ? "bg-primary/5 border-primary/20"
                    : "bg-gray-50 border-gray-100 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      isBooked ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                  <div>
                    <div className={cn(
                      "text-sm font-medium transition-colors",
                      isBooked ? "text-primary" : "text-gray-700"
                    )}>
                      {slot.time}
                    </div>
                    <div className="text-xs text-gray-400">{slot.label}</div>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                    isBooked
                      ? "bg-primary text-white scale-100"
                      : "bg-gray-200 scale-75 opacity-0"
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-4 pb-4">
          <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-2">
            ✨ Bookings sync automatically
          </div>
        </div>
      </div>
    </div>
  );
};
