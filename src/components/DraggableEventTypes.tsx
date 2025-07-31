import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { 
  MoreHorizontal, 
  ExternalLink, 
  Edit, 
  Copy as CopyIcon, 
  Trash2, 
  Clock2, 
  Copy, 
  GripVertical 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Switch } from './ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

interface EventType {
  id: string;
  title: string;
  description: string;
  url: string;
  durations: number[];
  bookingsToday: number;
  isActive: boolean;
  icon: any;
  iconName?: string;
  iconColor?: string;
}

interface Team {
  id: string;
  name: string;
  url: string;
  avatar: string;
  eventTypes: EventType[];
}

interface DraggableEventCardProps {
  event: EventType;
  selectedTeam: string;
  currentTeam: Team;
  isEventActive: boolean;
  copiedLink: string | null;
  onEventEdit: (eventId: string) => void;
  onCopyLink: (eventId: string, url: string) => void;
  onToggleEvent: (eventId: string, checked: boolean) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onIconClick: (eventId: string, currentIcon: string, currentColor: string) => void;
  isDragging?: boolean;
}

const DraggableEventCard: React.FC<DraggableEventCardProps> = ({
  event,
  selectedTeam,
  currentTeam,
  isEventActive,
  copiedLink,
  onEventEdit,
  onCopyLink,
  onToggleEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onIconClick,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get icon component from icon name or fallback to the stored icon
  const IconComponent = event.iconName 
    ? LucideIcons[event.iconName as keyof typeof LucideIcons] as React.ComponentType<any>
    : event.icon;

  const iconColor = event.iconColor || '#6366f1';

  const cardContent = (
    <div className="relative flex items-center">
      {/* Drag handle - outside the card */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 opacity-0 flex items-center justify-center w-6 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {/* Card content */}
      <div 
        className={`bg-card border border-border rounded-lg p-4 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer flex-1 ${
          !isEventActive ? 'opacity-50' : ''
        } ${isSortableDragging ? 'opacity-50 shadow-lg' : ''}`}
        onClick={() => onEventEdit(event.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIconClick(event.id, event.iconName || 'Calendar', iconColor);
                  }}
                  className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 hover:bg-muted/70 transition-colors group/icon"
                >
                  <IconComponent 
                    className="h-5 w-5 group-hover/icon:scale-110 transition-transform" 
                    style={{ color: iconColor }}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                <p className="text-xs">Click to change icon</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2 space-x-3">
                <h3 className="font-semibold text-foreground text-medium">
                  {event.title}
                </h3>
                
                {/* URL box with icons */}
                <div className="relative flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                  {selectedTeam === 'personal' ? (
                    <span>cal.id/sanskar</span>
                  ) : (
                    <span>{`cal.id/teams/${currentTeam?.url}`}</span>
                  )}                            
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url =
                              selectedTeam === 'personal'
                                ? '/sanskar'
                                : `/teams/${currentTeam?.url}`;
                            onCopyLink(event.id, url);
                          }}
                          className="p-1 hover:bg-muted rounded flex items-center justify-center"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs rounded-sm" side="bottom" sideOffset={6}>
                        Copy
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url =
                              selectedTeam === 'personal'
                                ? '/sanskar'
                                : `/teams/${currentTeam?.url}`;
                            window.open(`https://cal.id${url}`, '_blank');
                          }}
                          className="p-1 hover:bg-muted rounded flex items-center justify-center"
                          title="Preview event"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs rounded-sm" side="bottom" sideOffset={6}>
                        Preview
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {copiedLink === event.id && (
                    <div className="absolute top-full mt-1 left-1/2 ml-2 px-2 py-1 bg-foreground text-background text-xs rounded animate-fade-in whitespace-nowrap z-50">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
              <div className="flex items-center">
                {event.durations?.map(duration => (
                  <span key={duration} className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded mr-2">
                    <Clock2 className="h-3 w-3 mr-1" />
                    {duration}m
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {/* Enable toggle */}
            <Switch 
              checked={isEventActive} 
              onCheckedChange={checked => {
                onToggleEvent(event.id, checked);
              }}
              onClick={e => e.stopPropagation()}
            />
            
            {/* Options dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEventEdit(event.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicateEvent(event.id)}>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={setNodeRef} style={style} className="relative group animate-fade-in">
      {cardContent}
    </div>
  );
};

interface DraggableEventTypesProps {
  events: EventType[];
  selectedTeam: string;
  currentTeam: Team;
  eventStates: {[key: string]: boolean};
  copiedLink: string | null;
  onEventEdit: (eventId: string) => void;
  onCopyLink: (eventId: string, url: string) => void;
  onToggleEvent: (eventId: string, checked: boolean) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onReorderEvents: (events: EventType[]) => void;
  onIconClick: (eventId: string, currentIcon: string, currentColor: string) => void;
}

export const DraggableEventTypes: React.FC<DraggableEventTypesProps> = ({
  events,
  selectedTeam,
  currentTeam,
  eventStates,
  copiedLink,
  onEventEdit,
  onCopyLink,
  onToggleEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onReorderEvents,
  onIconClick,
}) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [reorderedEvents, setReorderedEvents] = React.useState(events);

  React.useEffect(() => {
    setReorderedEvents(events);
  }, [events]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = reorderedEvents.findIndex(event => event.id === active.id);
    const overIndex = reorderedEvents.findIndex(event => event.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newEvents = arrayMove(reorderedEvents, activeIndex, overIndex);
      setReorderedEvents(newEvents);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeIndex = reorderedEvents.findIndex(event => event.id === active.id);
    const overIndex = reorderedEvents.findIndex(event => event.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newEvents = arrayMove(reorderedEvents, activeIndex, overIndex);
      setReorderedEvents(newEvents);
      onReorderEvents(newEvents);
    }

    setActiveId(null);
  };

  const activeEvent = activeId ? reorderedEvents.find(event => event.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={reorderedEvents.map(event => event.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {reorderedEvents.map(event => {
            const isEventActive = eventStates[event.id] ?? event.isActive;
            return (
              <DraggableEventCard
                key={event.id}
                event={event}
                selectedTeam={selectedTeam}
                currentTeam={currentTeam}
                isEventActive={isEventActive}
                copiedLink={copiedLink}
                onEventEdit={onEventEdit}
                onCopyLink={onCopyLink}
                onToggleEvent={onToggleEvent}
                onDuplicateEvent={onDuplicateEvent}
                onDeleteEvent={onDeleteEvent}
                onIconClick={onIconClick}
              />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeEvent ? (
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg scale-105">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const IconComponent = activeEvent.iconName 
                      ? LucideIcons[activeEvent.iconName as keyof typeof LucideIcons] as React.ComponentType<any>
                      : activeEvent.icon;
                    return IconComponent ? (
                      <IconComponent 
                        className="h-5 w-5" 
                        style={{ color: activeEvent.iconColor || '#6366f1' }}
                      />
                    ) : null;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    {activeEvent.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {activeEvent.description}
                  </p>
                  <div className="flex items-center">
                    {activeEvent.durations?.map(duration => (
                      <span key={duration} className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded mr-2">
                        <Clock2 className="h-3 w-3 mr-1" />
                        {duration}m
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};