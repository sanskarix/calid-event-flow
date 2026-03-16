export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  avatar: string;
  createdAt: Date;
  lastMeeting: Date | null;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  contactId: string;
  meetingLink?: string;
  notes?: string;
}

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.com',
    phone: '+1 (555) 234-5678',
    notes: 'Key decision maker for Q2 partnership.',
    avatar: 'SC',
    createdAt: new Date('2024-11-15'),
    lastMeeting: new Date('2025-03-10'),
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.w@globex.io',
    phone: '+1 (555) 876-5432',
    notes: 'Interested in API integration.',
    avatar: 'JW',
    createdAt: new Date('2025-01-08'),
    lastMeeting: new Date('2025-03-14'),
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria@initech.co',
    phone: '+44 20 7946 0958',
    notes: '',
    avatar: 'MG',
    createdAt: new Date('2024-09-22'),
    lastMeeting: new Date('2025-02-28'),
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'dkim@soylent.dev',
    phone: '+1 (555) 345-6789',
    notes: 'Follow up on technical review.',
    avatar: 'DK',
    createdAt: new Date('2025-02-01'),
    lastMeeting: null,
  },
  {
    id: '5',
    name: 'Emily Novak',
    email: 'emily.novak@umbrella.org',
    phone: '+1 (555) 654-3210',
    notes: 'Met at SaaS Connect 2025.',
    avatar: 'EN',
    createdAt: new Date('2025-03-01'),
    lastMeeting: new Date('2025-03-12'),
  },
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex.t@waynetech.com',
    phone: '+1 (555) 111-2233',
    notes: '',
    avatar: 'AT',
    createdAt: new Date('2024-12-10'),
    lastMeeting: new Date('2025-03-08'),
  },
  {
    id: '7',
    name: 'Priya Sharma',
    email: 'priya@stark.ind',
    phone: '+91 98765 43210',
    notes: 'Potential integration partner.',
    avatar: 'PS',
    createdAt: new Date('2025-01-20'),
    lastMeeting: new Date('2025-03-05'),
  },
  {
    id: '8',
    name: 'Michael Brown',
    email: 'mbrown@oscorp.net',
    phone: '+1 (555) 999-8877',
    notes: 'High priority account.',
    avatar: 'MB',
    createdAt: new Date('2024-10-05'),
    lastMeeting: new Date('2025-03-15'),
  },
];

export const mockMeetings: Meeting[] = [
  { id: 'm1', title: 'Q2 Partnership Review', date: new Date('2025-03-18T10:00:00'), duration: 45, status: 'upcoming', contactId: '1', meetingLink: 'https://meet.google.com/abc-def' },
  { id: 'm2', title: 'API Integration Call', date: new Date('2025-03-19T14:00:00'), duration: 30, status: 'upcoming', contactId: '2', meetingLink: 'https://zoom.us/j/123' },
  { id: 'm3', title: 'Product Demo', date: new Date('2025-03-10T11:00:00'), duration: 60, status: 'completed', contactId: '1', notes: 'Showed new dashboard features.' },
  { id: 'm4', title: 'Technical Review', date: new Date('2025-03-14T09:00:00'), duration: 30, status: 'completed', contactId: '2' },
  { id: 'm5', title: 'Sales Alignment', date: new Date('2025-02-28T15:00:00'), duration: 45, status: 'completed', contactId: '3' },
  { id: 'm6', title: 'Design Review', date: new Date('2025-03-08T13:00:00'), duration: 30, status: 'completed', contactId: '6' },
  { id: 'm7', title: 'Integration Planning', date: new Date('2025-03-05T10:30:00'), duration: 60, status: 'completed', contactId: '7' },
  { id: 'm8', title: 'Executive Briefing', date: new Date('2025-03-15T16:00:00'), duration: 30, status: 'completed', contactId: '8' },
  { id: 'm9', title: 'Follow-up Call', date: new Date('2025-03-20T11:00:00'), duration: 30, status: 'upcoming', contactId: '5' },
  { id: 'm10', title: 'Onboarding Kickoff', date: new Date('2025-03-22T09:00:00'), duration: 60, status: 'upcoming', contactId: '4' },
  { id: 'm11', title: 'Strategy Session', date: new Date('2025-03-12T14:00:00'), duration: 45, status: 'cancelled', contactId: '5' },
];
