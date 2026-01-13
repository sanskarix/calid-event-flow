import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Video, Coffee, Users, Briefcase, Phone, Sparkles } from "lucide-react";

interface FloatingMeeting {
  id: number;
  x: number;
  y: number;
  icon: React.ReactNode;
  label: string;
  time: string;
  color: string;
  size: "sm" | "md" | "lg";
  velocity: { x: number; y: number };
}

const iconComponents = [
  { icon: <Video className="w-5 h-5" />, label: "Team Sync", color: "from-blue-500/20 to-blue-600/20 border-blue-400/30" },
  { icon: <Coffee className="w-5 h-5" />, label: "Coffee Chat", color: "from-amber-500/20 to-orange-600/20 border-amber-400/30" },
  { icon: <Users className="w-5 h-5" />, label: "1:1 Meeting", color: "from-emerald-500/20 to-green-600/20 border-emerald-400/30" },
  { icon: <Briefcase className="w-5 h-5" />, label: "Interview", color: "from-purple-500/20 to-violet-600/20 border-purple-400/30" },
  { icon: <Phone className="w-5 h-5" />, label: "Quick Call", color: "from-rose-500/20 to-pink-600/20 border-rose-400/30" },
];

const times = ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "4:00 PM"];
const sizes: ("sm" | "md" | "lg")[] = ["sm", "md", "lg", "md", "sm"];

export const AnimatedCalendar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [meetings, setMeetings] = useState<FloatingMeeting[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize floating meetings
  useEffect(() => {
    const initialMeetings: FloatingMeeting[] = iconComponents.map((item, i) => ({
      id: i,
      x: 60 + Math.random() * 280,
      y: 60 + Math.random() * 300,
      icon: item.icon,
      label: item.label,
      time: times[i],
      color: item.color,
      size: sizes[i],
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));
    setMeetings(initialMeetings);
  }, []);

  // Floating animation
  useEffect(() => {
    if (draggedId !== null) return;

    const interval = setInterval(() => {
      setMeetings((prev) =>
        prev.map((meeting) => {
          let newX = meeting.x + meeting.velocity.x;
          let newY = meeting.y + meeting.velocity.y;
          let newVelX = meeting.velocity.x;
          let newVelY = meeting.velocity.y;

          // Bounce off walls
          if (newX < 50 || newX > 350) newVelX *= -1;
          if (newY < 50 || newY > 380) newVelY *= -1;

          // Keep in bounds
          newX = Math.max(50, Math.min(350, newX));
          newY = Math.max(50, Math.min(380, newY));

          return {
            ...meeting,
            x: newX,
            y: newY,
            velocity: { x: newVelX, y: newVelY },
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [draggedId]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggedId !== null) {
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === draggedId
            ? { ...m, x: x - dragOffset.x, y: y - dragOffset.y }
            : m
        )
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent, meeting: FloatingMeeting) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDraggedId(meeting.id);
    setDragOffset({ x: x - meeting.x, y: y - meeting.y });
  };

  const handleMouseUp = () => {
    if (draggedId !== null) {
      // Give it a little velocity when released
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === draggedId
            ? {
                ...m,
                velocity: {
                  x: (Math.random() - 0.5) * 0.8,
                  y: (Math.random() - 0.5) * 0.8,
                },
              }
            : m
        )
      );
    }
    setDraggedId(null);
  };

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-xs";
      case "lg":
        return "px-5 py-4 text-sm";
      default:
        return "px-4 py-3 text-sm";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 shadow-2xl cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: isHovering
              ? `translate(${(mousePos.x - 200) * 0.02}px, ${(mousePos.y - 200) * 0.02}px)`
              : "none",
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Glowing orbs that follow cursor */}
      <div
        className="absolute w-64 h-64 rounded-full bg-primary/20 blur-[100px] transition-all duration-700 ease-out pointer-events-none"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      />
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-500/20 blur-[60px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-purple-500/20 blur-[50px] animate-pulse pointer-events-none" />

      {/* Instruction hint */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white/40 text-xs pointer-events-none z-10">
        <Sparkles className="w-3 h-3" />
        <span>Drag the meetings around!</span>
      </div>

      {/* Floating meeting bubbles */}
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className={cn(
            "absolute cursor-grab active:cursor-grabbing select-none",
            "rounded-2xl backdrop-blur-md bg-gradient-to-br border",
            "shadow-lg hover:shadow-xl transition-shadow duration-200",
            "flex items-center gap-2 text-white/90",
            meeting.color,
            getSizeClasses(meeting.size),
            draggedId === meeting.id && "scale-110 z-50 shadow-2xl ring-2 ring-white/20"
          )}
          style={{
            left: meeting.x,
            top: meeting.y,
            transform: `translate(-50%, -50%) ${
              draggedId === meeting.id ? "scale(1.1)" : "scale(1)"
            }`,
            transition: draggedId === meeting.id ? "none" : "transform 0.2s ease-out, box-shadow 0.2s ease-out",
          }}
          onMouseDown={(e) => handleMouseDown(e, meeting)}
        >
          <div className="flex-shrink-0 opacity-80">{meeting.icon}</div>
          <div className="flex flex-col">
            <span className="font-medium whitespace-nowrap">{meeting.label}</span>
            <span className="text-[10px] text-white/50">{meeting.time}</span>
          </div>
        </div>
      ))}

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="text-white/30 text-xs">
          Your schedule, beautifully organized
        </span>
      </div>
    </div>
  );
};
