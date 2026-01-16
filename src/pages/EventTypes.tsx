import React, { useState, useRef, useEffect } from 'react';
import { Plus, ExternalLink, Search, Copy, Calendar, Clock2, Users, Video, Coffee, Briefcase, GraduationCap, Heart, Zap, Target, User, X, Trash2, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CreateEventModal } from '../components/CreateEventModal';
import { CreateTeamEventModal } from '../components/CreateTeamEventModal';
import { DraggableEventTypes } from '../components/DraggableEventTypes';
import { IconPicker } from '../components/IconPicker';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

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

const getEventIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('interview') || lowerTitle.includes('technical')) return 'Briefcase';
  if (lowerTitle.includes('coffee') || lowerTitle.includes('chat')) return 'Coffee';
  if (lowerTitle.includes('demo') || lowerTitle.includes('presentation')) return 'Video';
  if (lowerTitle.includes('meeting') || lowerTitle.includes('sync')) return 'Users';
  if (lowerTitle.includes('consultation') || lowerTitle.includes('1:1')) return 'Clock2';
  if (lowerTitle.includes('training') || lowerTitle.includes('workshop')) return 'GraduationCap';
  if (lowerTitle.includes('review') || lowerTitle.includes('assessment')) return 'Target';
  if (lowerTitle.includes('strategy') || lowerTitle.includes('planning')) return 'Zap';
  if (lowerTitle.includes('mentorship') || lowerTitle.includes('guidance')) return 'Heart';
  return 'Calendar';
};

export const EventTypes = () => {
  const [selectedTeam, setSelectedTeam] = useState('personal');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [selectedTeamForCreation, setSelectedTeamForCreation] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventStates, setEventStates] = useState<{[key: string]: boolean}>({});
  const [teamEvents, setTeamEvents] = useState<Team[]>([]);
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedEventForIcon, setSelectedEventForIcon] = useState<{id: string, icon: string, color: string} | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  const newDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load teams from localStorage
  useEffect(() => {
    const loadTeams = () => {
      // Default teams with 10 event types each
      const defaultTeams = [
        {
          id: 'personal',
          name: 'Sanskar Yadav',
          url: 'sanskar',
          avatar: 'S',
          eventTypes: [
            { id: 'p1', title: '15 Minute Meeting', description: 'Quick catch-up call for brief discussions', url: '/sanskar/15min', durations: [15], bookingsToday: 3, isActive: true, icon: Clock2, iconName: 'Clock2', iconColor: '#6366f1' },
            { id: 'p2', title: '30 Minute Meeting', description: 'Standard meeting for detailed conversations', url: '/sanskar/30min', durations: [30], bookingsToday: 5, isActive: true, icon: Users, iconName: 'Users', iconColor: '#8b5cf6' },
            { id: 'p3', title: '1 Hour Consultation', description: 'In-depth consultation and planning session', url: '/sanskar/consultation', durations: [60], bookingsToday: 2, isActive: true, icon: Clock2, iconName: 'Clock2', iconColor: '#ec4899' },
            { id: 'p4', title: 'Coffee Chat', description: 'Informal coffee meeting for networking', url: '/sanskar/coffee', durations: [30], bookingsToday: 1, isActive: true, icon: Coffee, iconName: 'Coffee', iconColor: '#f97316' },
            { id: 'p5', title: 'Demo Session', description: 'Product demonstration and Q&A', url: '/sanskar/demo', durations: [45], bookingsToday: 4, isActive: true, icon: Video, iconName: 'Video', iconColor: '#ef4444' },
            { id: 'p6', title: 'Job Interview', description: 'Job interview and candidate assessment', url: '/sanskar/interview', durations: [60], bookingsToday: 0, isActive: true, icon: Briefcase, iconName: 'Briefcase', iconColor: '#22c55e' },
            { id: 'p7', title: 'Mentorship Session', description: 'One-on-one mentoring and guidance', url: '/sanskar/mentorship', durations: [45], bookingsToday: 2, isActive: true, icon: Heart, iconName: 'Heart', iconColor: '#10b981' },
            { id: 'p8', title: 'Project Review', description: 'Review project progress and feedback', url: '/sanskar/review', durations: [30], bookingsToday: 1, isActive: true, icon: Target, iconName: 'Target', iconColor: '#06b6d4' },
            { id: 'p9', title: 'Strategy Planning', description: 'Strategic planning and roadmap discussion', url: '/sanskar/strategy', durations: [60], bookingsToday: 0, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#3b82f6' },
            { id: 'p10', title: 'Quick Sync', description: 'Brief sync-up and status update', url: '/sanskar/sync', durations: [15], bookingsToday: 3, isActive: true, icon: Users, iconName: 'Users', iconColor: '#64748b' },
          ]
        },
        {
          id: 'meta',
          name: 'Meta',
          url: 'meta',
          avatar: 'M',
          eventTypes: [
            { id: 'm1', title: 'Technical Interview', description: 'Software engineering technical assessment', url: '/meta/tech-interview', durations: [60], bookingsToday: 8, isActive: true, icon: Briefcase, iconName: 'Briefcase', iconColor: '#6366f1' },
            { id: 'm2', title: 'Product Review', description: 'Product feature review and feedback', url: '/meta/product-review', durations: [45], bookingsToday: 5, isActive: true, icon: Target, iconName: 'Target', iconColor: '#8b5cf6' },
            { id: 'm3', title: 'Design Critique', description: 'UI/UX design review session', url: '/meta/design-critique', durations: [30], bookingsToday: 3, isActive: true, icon: Target, iconName: 'Target', iconColor: '#ec4899' },
            { id: 'm4', title: 'Engineering Sync', description: 'Team engineering synchronization', url: '/meta/eng-sync', durations: [30], bookingsToday: 12, isActive: true, icon: Users, iconName: 'Users', iconColor: '#f97316' },
            { id: 'm5', title: 'Leadership 1:1', description: 'One-on-one with engineering leadership', url: '/meta/leadership', durations: [30], bookingsToday: 2, isActive: true, icon: Clock2, iconName: 'Clock2', iconColor: '#ef4444' },
            { id: 'm6', title: 'Code Review', description: 'Collaborative code review session', url: '/meta/code-review', durations: [45], bookingsToday: 7, isActive: true, icon: Target, iconName: 'Target', iconColor: '#22c55e' },
            { id: 'm7', title: 'Architecture Discussion', description: 'System architecture planning meeting', url: '/meta/architecture', durations: [60], bookingsToday: 1, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#10b981' },
            { id: 'm8', title: 'Sprint Planning', description: 'Agile sprint planning session', url: '/meta/sprint-planning', durations: [90], bookingsToday: 1, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#06b6d4' },
            { id: 'm9', title: 'Performance Review', description: 'Employee performance evaluation', url: '/meta/performance', durations: [45], bookingsToday: 0, isActive: true, icon: Target, iconName: 'Target', iconColor: '#3b82f6' },
            { id: 'm10', title: 'Innovation Workshop', description: 'Brainstorming and innovation session', url: '/meta/innovation', durations: [120], bookingsToday: 0, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#64748b' },
          ]
        },
        {
          id: 'google',
          name: 'Google',
          url: 'google',
          avatar: 'G',
          eventTypes: [
            { id: 'g1', title: 'System Design Interview', description: 'Large-scale system design assessment', url: '/google/system-design', durations: [60], bookingsToday: 6, isActive: true, icon: Briefcase, iconName: 'Briefcase', iconColor: '#6366f1' },
            { id: 'g2', title: 'Coding Interview', description: 'Algorithm and data structure interview', url: '/google/coding', durations: [45], bookingsToday: 10, isActive: true, icon: Briefcase, iconName: 'Briefcase', iconColor: '#8b5cf6' },
            { id: 'g3', title: 'Behavioral Interview', description: 'Leadership and behavioral assessment', url: '/google/behavioral', durations: [45], bookingsToday: 4, isActive: true, icon: Briefcase, iconName: 'Briefcase', iconColor: '#ec4899' },
            { id: 'g4', title: 'Team Collaboration', description: 'Cross-team collaboration meeting', url: '/google/collaboration', durations: [30], bookingsToday: 15, isActive: true, icon: Users, iconName: 'Users', iconColor: '#f97316' },
            { id: 'g5', title: 'Research Discussion', description: 'AI/ML research and development talk', url: '/google/research', durations: [60], bookingsToday: 2, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#ef4444' },
            { id: 'g6', title: 'Product Strategy', description: 'Product roadmap and strategy session', url: '/google/strategy', durations: [60], bookingsToday: 3, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#22c55e' },
            { id: 'g7', title: 'Tech Talk', description: 'Internal technology presentation', url: '/google/tech-talk', durations: [45], bookingsToday: 1, isActive: true, icon: Video, iconName: 'Video', iconColor: '#10b981' },
            { id: 'g8', title: 'Peer Review', description: 'Peer performance and project review', url: '/google/peer-review', durations: [30], bookingsToday: 5, isActive: true, icon: Target, iconName: 'Target', iconColor: '#06b6d4' },
            { id: 'g9', title: 'Innovation Time', description: '20% time project discussion', url: '/google/innovation', durations: [45], bookingsToday: 1, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#3b82f6' },
            { id: 'g10', title: 'Onboarding Session', description: 'New hire onboarding and orientation', url: '/google/onboarding', durations: [90], bookingsToday: 2, isActive: true, icon: GraduationCap, iconName: 'GraduationCap', iconColor: '#64748b' },
          ]
        },
        {
          id: 'tesla',
          name: 'Tesla',
          url: 'tesla',
          avatar: 'T',
          eventTypes: [
            { id: 't1', title: 'Engineering Review', description: 'Vehicle engineering design review', url: '/tesla/eng-review', durations: [60], bookingsToday: 4, isActive: true, icon: Target, iconName: 'Target', iconColor: '#6366f1' },
            { id: 't2', title: 'Safety Assessment', description: 'Vehicle safety protocol evaluation', url: '/tesla/safety', durations: [45], bookingsToday: 2, isActive: true, icon: Target, iconName: 'Target', iconColor: '#8b5cf6' },
            { id: 't3', title: 'Manufacturing Sync', description: 'Production line coordination meeting', url: '/tesla/manufacturing', durations: [30], bookingsToday: 8, isActive: true, icon: Users, iconName: 'Users', iconColor: '#ec4899' },
            { id: 't4', title: 'Battery Technology', description: 'Battery innovation and development', url: '/tesla/battery', durations: [60], bookingsToday: 3, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#f97316' },
            { id: 't5', title: 'Autopilot Review', description: 'Self-driving technology assessment', url: '/tesla/autopilot', durations: [90], bookingsToday: 1, isActive: true, icon: Target, iconName: 'Target', iconColor: '#ef4444' },
            { id: 't6', title: 'Supply Chain', description: 'Supplier coordination and planning', url: '/tesla/supply-chain', durations: [45], bookingsToday: 6, isActive: true, icon: Target, iconName: 'Target', iconColor: '#22c55e' },
            { id: 't7', title: 'Quality Control', description: 'Product quality assurance meeting', url: '/tesla/quality', durations: [30], bookingsToday: 7, isActive: true, icon: Target, iconName: 'Target', iconColor: '#10b981' },
            { id: 't8', title: 'Innovation Lab', description: 'R&D and future technology planning', url: '/tesla/innovation', durations: [120], bookingsToday: 0, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#06b6d4' },
            { id: 't9', title: 'Sustainability', description: 'Environmental impact and sustainability', url: '/tesla/sustainability', durations: [45], bookingsToday: 1, isActive: true, icon: Heart, iconName: 'Heart', iconColor: '#3b82f6' },
            { id: 't10', title: 'Market Analysis', description: 'Market research and competitive analysis', url: '/tesla/market', durations: [60], bookingsToday: 2, isActive: true, icon: Target, iconName: 'Target', iconColor: '#64748b' },
          ]
        },
        {
          id: 'onehash',
          name: 'OneHash',
          url: 'onehash',
          avatar: 'O',
          eventTypes: [
            { id: 'o1', title: 'Client Onboarding', description: 'New client setup and training session', url: '/onehash/onboarding', durations: [60], bookingsToday: 5, isActive: true, icon: GraduationCap, iconName: 'GraduationCap', iconColor: '#6366f1' },
            { id: 'o2', title: 'Product Demo', description: 'ERP software demonstration', url: '/onehash/demo', durations: [45], bookingsToday: 8, isActive: true, icon: Video, iconName: 'Video', iconColor: '#8b5cf6' },
            { id: 'o3', title: 'Implementation Planning', description: 'ERP implementation strategy meeting', url: '/onehash/implementation', durations: [90], bookingsToday: 2, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#ec4899' },
            { id: 'o4', title: 'Support Session', description: 'Customer support and troubleshooting', url: '/onehash/support', durations: [30], bookingsToday: 12, isActive: true, icon: Clock2, iconName: 'Clock2', iconColor: '#f97316' },
            { id: 'o5', title: 'Feature Request', description: 'Product feature discussion and planning', url: '/onehash/feature', durations: [45], bookingsToday: 3, isActive: true, icon: Target, iconName: 'Target', iconColor: '#ef4444' },
            { id: 'o6', title: 'Training Workshop', description: 'User training and best practices', url: '/onehash/training', durations: [120], bookingsToday: 1, isActive: true, icon: GraduationCap, iconName: 'GraduationCap', iconColor: '#22c55e' },
            { id: 'o7', title: 'Sales Consultation', description: 'Pre-sales consultation and needs analysis', url: '/onehash/sales', durations: [45], bookingsToday: 6, isActive: true, icon: Clock2, iconName: 'Clock2', iconColor: '#10b981' },
            { id: 'o8', title: 'Integration Planning', description: 'Third-party integration discussion', url: '/onehash/integration', durations: [60], bookingsToday: 1, isActive: true, icon: Zap, iconName: 'Zap', iconColor: '#06b6d4' },
            { id: 'o9', title: 'Business Review', description: 'Quarterly business review meeting', url: '/onehash/review', durations: [90], bookingsToday: 0, isActive: true, icon: Target, iconName: 'Target', iconColor: '#3b82f6' },
            { id: 'o10', title: 'Custom Development', description: 'Custom feature development discussion', url: '/onehash/custom', durations: [60], bookingsToday: 2, isActive: true, icon: Target, iconName: 'Target', iconColor: '#64748b' },
          ]
        }
      ];

      setTeamEvents(defaultTeams);
    };

    loadTeams();
  }, []);

  const currentTeam = teamEvents.find(t => t.id === selectedTeam) || teamEvents[0];
  const filteredEvents = currentTeam?.eventTypes?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Initialize event states
  useEffect(() => {
    const initialStates: {[key: string]: boolean} = {};
    teamEvents.forEach(team => {
      team.eventTypes?.forEach(event => {
        initialStates[event.id] = event.isActive;
      });
    });
    setEventStates(initialStates);
  }, [teamEvents]);

  const handleEventEdit = (eventId: string) => {
    navigate(`/event/${eventId}/setup`);
  };

  useEffect(() => {
    setHeaderMeta({
      title: 'Event Types',
      description: 'Manage your event types and booking configurations.',
    });
  }, [setHeaderMeta]);


  const handleCreateEvent = (eventData: any) => {
    console.log('Creating event with data:', eventData);
    const newEventId = `event-${Date.now()}`;
    const iconName = getEventIcon(eventData.title || 'New Event');
    const newEvent: EventType = {
      id: newEventId,
      title: eventData.title || 'New Event',
      description: eventData.description || 'A new event',
      url: `/${currentTeam.url}/${eventData.url || 'new-event'}`,
      durations: [parseInt(eventData.duration) || 30],
      bookingsToday: 0,
      isActive: true,
      icon: LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>,
      iconName: iconName,
      iconColor: '#6366f1'
    };

    setTeamEvents(prevTeams => prevTeams.map(team => 
      team.id === selectedTeam 
        ? { ...team, eventTypes: [...(team.eventTypes || []), newEvent] }
        : team
    ));

    setEventStates(prev => ({ ...prev, [newEventId]: true }));
    setIsCreateModalOpen(false);
    navigate(`/event/${newEventId}/setup`);
  };

  const handleCopyLink = (eventId: string, url: string) => {
    navigator.clipboard.writeText(`https://cal.id${url}`);
    setCopiedLink(eventId);
    setTimeout(() => setCopiedLink(null), 1500);
  };

  const handleCopyPublicLink = () => {
    const publicUrl = selectedTeam === 'personal' ? 'https://cal.id/sanskar' : `https://cal.id/teams/${currentTeam?.url}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 1500);
  };

  const handleToggleEvent = (eventId: string, checked: boolean) => {
    setEventStates(prev => ({ ...prev, [eventId]: checked }));
  };

  const handleReorderEvents = (reorderedEvents: EventType[]) => {
    setTeamEvents(prevTeams => prevTeams.map(team => 
      team.id === selectedTeam 
        ? { ...team, eventTypes: reorderedEvents }
        : team
    ));
  };

  const handleIconClick = (eventId: string, currentIcon: string, currentColor: string) => {
    setSelectedEventForIcon({ id: eventId, icon: currentIcon, color: currentColor });
    setIsIconPickerOpen(true);
  };

  const handleIconSelect = (iconName: string, color: string) => {
    if (!selectedEventForIcon) return;
    
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    
    setTeamEvents(prevTeams => prevTeams.map(team => ({
      ...team,
      eventTypes: team.eventTypes.map(event => 
        event.id === selectedEventForIcon.id 
          ? { 
              ...event, 
              icon: IconComponent,
              iconName: iconName,
              iconColor: color
            }
          : event
      )
    })));

    setSelectedEventForIcon(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newDropdownRef.current && !newDropdownRef.current.contains(event.target as Node)) {
        setShowNewDropdown(false);
      }
    };

    if (showNewDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDropdown]);

  const handleNewSelection = (teamId: string) => {
    setShowNewDropdown(false);
    if (teamId === 'personal') {
      setIsCreateModalOpen(true);
    } else {
      setSelectedTeamForCreation(teamId);
      setIsCreateTeamModalOpen(true);
    }
  };

  const handleDuplicateEvent = (eventId: string) => {
    const originalEvent = teamEvents.find(team => 
      team.eventTypes?.some(event => event.id === eventId)
    )?.eventTypes?.find(event => event.id === eventId);
    
    if (originalEvent) {
      const newEventId = `${eventId}-copy-${Date.now()}`;
      const duplicatedEvent: EventType = {
        ...originalEvent,
        id: newEventId,
        title: `${originalEvent.title} (Copy)`,
        url: `${originalEvent.url}-copy`,
        bookingsToday: 0
      };

      setTeamEvents(prevTeams => prevTeams.map(team => {
        const hasEvent = team.eventTypes?.some(event => event.id === eventId);
        if (hasEvent) {
          return { ...team, eventTypes: [...(team.eventTypes || []), duplicatedEvent] };
        }
        return team;
      }));

      setEventStates(prev => ({ ...prev, [newEventId]: true }));
    }
  };

  const handleDeleteClick = (eventId: string) => {
    const event = teamEvents.find(team => 
      team.eventTypes?.some(e => e.id === eventId)
    )?.eventTypes?.find(e => e.id === eventId);
    
    if (event) {
      setEventToDelete(event);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setTeamEvents(prevTeams => prevTeams.map(team => ({
        ...team,
        eventTypes: team.eventTypes?.filter(event => event.id !== eventToDelete.id) || []
      })));
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  if (!teamEvents.length) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Horizontal Tabs */}
      <div className="bg-background border-b border-border">
        <div className="px-8">
          <div className="flex items-center">
            {/* Personal tab */}
            <button
              onClick={() => setSelectedTeam('personal')}
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedTeam === 'personal'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  selectedTeam === 'personal' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted-foreground/20'
                }`}>
                  S
                </div>
                <span>Sanskar Yadav</span>
              </div>
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-border mx-4"></div>

            {/* Team tabs - scrollable */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex space-x-0">
                {teamEvents.filter(team => team.id !== 'personal').map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      selectedTeam === team.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedTeam === team.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted-foreground/20'
                      }`}>
                        {team.avatar}
                      </div>
                      <span>{team.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pt-6 pb-6 space-y-4 w-full max-w-full">
        {/* Search Bar and New Button */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm" 
              />
            </div>
            
            <div className="relative flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
              <span className="text-sm">
                {selectedTeam === 'personal' ? 'cal.id/sanskar' : `cal.id/teams/${currentTeam?.url}`}
              </span>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button 
                    onClick={handleCopyPublicLink} 
                    className="p-1 hover:bg-muted rounded flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4" />
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
                      onClick={() => {
                        const publicUrl = selectedTeam === 'personal' ? 'https://cal.id/sanskar' : `https://cal.id/teams/${currentTeam?.url}`;
                        window.open(publicUrl, '_blank');
                      }}
                      className="p-1 hover:bg-muted rounded flex items-center justify-center"
                      title="Open public page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs rounded-sm" side="bottom" sideOffset={6}>
                    Preview
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {copiedPublicLink && (
                <div className="absolute top-full mt-1 left-1/2 ml-2 px-2 py-1 bg-white text-black text-xs rounded border border-gray-200 shadow-md animate-fade-in whitespace-nowrap z-50">
                  Copied!
                </div>
              )}
            </div>
          </div>
          
          <div className="relative" ref={newDropdownRef}>
            <button 
              onClick={() => setShowNewDropdown(!showNewDropdown)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </button>
            
            {showNewDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg animate-scale-in z-10">
                <div className="py-1">
                  <button 
                    onClick={() => handleNewSelection('personal')} 
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Personal Event
                  </button>
                  {teamEvents.filter(team => team.id !== 'personal').map(team => (
                    <button 
                      key={team.id}
                      onClick={() => handleNewSelection(team.id)} 
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground mr-2">
                        {team.avatar}
                      </div>
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Draggable Event Types List */}
        <DraggableEventTypes
          events={filteredEvents}
          selectedTeam={selectedTeam}
          currentTeam={currentTeam!}
          eventStates={eventStates}
          copiedLink={copiedLink}
          onEventEdit={handleEventEdit}
          onCopyLink={handleCopyLink}
          onToggleEvent={handleToggleEvent}
          onDuplicateEvent={handleDuplicateEvent}
          onDeleteEvent={handleDeleteClick}
          onReorderEvents={handleReorderEvents}
          onIconClick={handleIconClick}
        />

        <CreateEventModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreateEvent={handleCreateEvent} 
        />

        <CreateTeamEventModal
          open={isCreateTeamModalOpen}
          onClose={() => setIsCreateTeamModalOpen(false)}
          teamId={selectedTeamForCreation}
          teamName={teamEvents.find(t => t.id === selectedTeamForCreation)?.name || ''}
        />

        <IconPicker
          isOpen={isIconPickerOpen}
          onClose={() => {
            setIsIconPickerOpen(false);
            setSelectedEventForIcon(null);
          }}
          currentIcon={selectedEventForIcon?.icon || 'Calendar'}
          currentColor={selectedEventForIcon?.color || '#6366f1'}
          onSelectIcon={handleIconSelect}
        />

        {/* Delete Event Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Delete Event Type</h2>
                  <p className="text-muted-foreground">
                    Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone and all associated bookings will be affected.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, delete event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};