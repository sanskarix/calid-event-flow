import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CreditCard, MessageCircle, Users, Calendar, Video, Zap, Sparkles } from "lucide-react";

interface FloatingFeature {
  id: number;
  x: number;
  y: number;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  size: "sm" | "md" | "lg";
  velocity: { x: number; y: number };
}

const featureComponents = [
  { icon: <CreditCard className="w-5 h-5" />, label: "Razorpay", description: "Payments", color: "from-blue-500/30 to-blue-600/30 border-blue-400/40 text-blue-900" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp Business", description: "Messaging", color: "from-green-500/30 to-green-600/30 border-green-400/40 text-green-900" },
  { icon: <Users className="w-5 h-5" />, label: "Team Meetings", description: "Collaborate", color: "from-purple-500/30 to-violet-600/30 border-purple-400/40 text-purple-900" },
  { icon: <Calendar className="w-5 h-5" />, label: "Google Calendar", description: "Sync", color: "from-red-500/30 to-orange-600/30 border-red-400/40 text-red-900" },
  { icon: <Video className="w-5 h-5" />, label: "Zoom", description: "Video calls", color: "from-sky-500/30 to-cyan-600/30 border-sky-400/40 text-sky-900" },
  { icon: <Zap className="w-5 h-5" />, label: "Zapier", description: "Automate", color: "from-amber-500/30 to-orange-600/30 border-amber-400/40 text-amber-900" },
];

const sizes: ("sm" | "md" | "lg")[] = ["md", "lg", "md", "sm", "md", "sm"];

export const AnimatedCalendar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [features, setFeatures] = useState<FloatingFeature[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize floating features
  useEffect(() => {
    const initialFeatures: FloatingFeature[] = featureComponents.map((item, i) => ({
      id: i,
      x: 60 + Math.random() * 280,
      y: 60 + Math.random() * 300,
      icon: item.icon,
      label: item.label,
      description: item.description,
      color: item.color,
      size: sizes[i],
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));
    setFeatures(initialFeatures);
  }, []);

  // Floating animation
  useEffect(() => {
    if (draggedId !== null) return;

    const interval = setInterval(() => {
      setFeatures((prev) =>
        prev.map((feature) => {
          let newX = feature.x + feature.velocity.x;
          let newY = feature.y + feature.velocity.y;
          let newVelX = feature.velocity.x;
          let newVelY = feature.velocity.y;

          // Bounce off walls
          if (newX < 50 || newX > 350) newVelX *= -1;
          if (newY < 50 || newY > 380) newVelY *= -1;

          // Keep in bounds
          newX = Math.max(50, Math.min(350, newX));
          newY = Math.max(50, Math.min(380, newY));

          return {
            ...feature,
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
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === draggedId
            ? { ...f, x: x - dragOffset.x, y: y - dragOffset.y }
            : f
        )
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent, feature: FloatingFeature) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDraggedId(feature.id);
    setDragOffset({ x: x - feature.x, y: y - feature.y });
  };

  const handleMouseUp = () => {
    if (draggedId !== null) {
      // Give it a little velocity when released
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === draggedId
            ? {
                ...f,
                velocity: {
                  x: (Math.random() - 0.5) * 0.8,
                  y: (Math.random() - 0.5) * 0.8,
                },
              }
            : f
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
      className="relative w-full h-[450px] rounded-3xl overflow-hidden bg-transparent cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
    >
      {/* Subtle animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
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
        className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[100px] transition-all duration-700 ease-out pointer-events-none"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
          opacity: isHovering ? 0.5 : 0.2,
        }}
      />
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-[60px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-purple-500/10 blur-[50px] animate-pulse pointer-events-none" />

      {/* Instruction hint */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 text-xs pointer-events-none z-10">
        <Sparkles className="w-3 h-3" />
        <span>Drag the integrations!</span>
      </div>

      {/* Floating feature bubbles */}
      {features.map((feature) => (
        <div
          key={feature.id}
          className={cn(
            "absolute cursor-grab active:cursor-grabbing select-none",
            "rounded-2xl backdrop-blur-sm bg-gradient-to-br border",
            "shadow-lg hover:shadow-xl transition-shadow duration-200",
            "flex items-center gap-2",
            feature.color,
            getSizeClasses(feature.size),
            draggedId === feature.id && "scale-110 z-50 shadow-2xl ring-2 ring-primary/20"
          )}
          style={{
            left: feature.x,
            top: feature.y,
            transform: `translate(-50%, -50%) ${
              draggedId === feature.id ? "scale(1.1)" : "scale(1)"
            }`,
            transition: draggedId === feature.id ? "none" : "transform 0.2s ease-out, box-shadow 0.2s ease-out",
          }}
          onMouseDown={(e) => handleMouseDown(e, feature)}
        >
          <div className="flex-shrink-0 opacity-80">{feature.icon}</div>
          <div className="flex flex-col">
            <span className="font-medium whitespace-nowrap">{feature.label}</span>
            <span className="text-[10px] opacity-60">{feature.description}</span>
          </div>
        </div>
      ))}

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="text-gray-400 text-xs">
          All your tools, one platform
        </span>
      </div>
    </div>
  );
};
