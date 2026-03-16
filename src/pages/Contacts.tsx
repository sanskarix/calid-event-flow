import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Search, Plus, Filter, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight,
  MoreHorizontal, Share2, CalendarPlus, User, Mail, Phone, Building2, Loader2, UserX, SearchX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockContacts, type Contact } from '@/data/contactsData';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { ShareAvailabilityModal } from '@/components/contacts/ShareAvailabilityModal';
import { ScheduleMeetingModal } from '@/components/contacts/ScheduleMeetingModal';
import { useHeaderConfig } from '@/contexts/HeaderContext';
import { useEffect } from 'react';

type SortKey = 'name' | 'company' | 'lastMeeting' | 'createdAt';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

const tagColors: Record<string, string> = {
  client: 'bg-primary/10 text-primary border-primary/20',
  prospect: 'bg-amber-50 text-amber-700 border-amber-200',
  partner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  enterprise: 'bg-violet-50 text-violet-700 border-violet-200',
  tech: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function Contacts() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setHeaderConfig } = useHeaderConfig();

  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [loading] = useState(false);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [shareContact, setShareContact] = useState<Contact | null>(null);
  const [scheduleContact, setScheduleContact] = useState<Contact | null>(null);

  useEffect(() => {
    setHeaderConfig({ title: 'Contacts', description: 'Manage your contacts and schedule meetings' });
  }, [setHeaderConfig]);

  const companies = useMemo(() => [...new Set(contacts.map(c => c.company))].sort(), [contacts]);
  const allTags = useMemo(() => [...new Set(contacts.flatMap(c => c.tags))].sort(), [contacts]);

  const filtered = useMemo(() => {
    let list = [...contacts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    if (companyFilter) list = list.filter(c => c.company === companyFilter);
    if (tagFilter) list = list.filter(c => c.tags.includes(tagFilter));

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'company') cmp = a.company.localeCompare(b.company);
      else if (sortKey === 'lastMeeting') cmp = (a.lastMeeting?.getTime() ?? 0) - (b.lastMeeting?.getTime() ?? 0);
      else if (sortKey === 'createdAt') cmp = a.createdAt.getTime() - b.createdAt.getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [contacts, search, companyFilter, tagFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSaveContact = (data: Partial<Contact>) => {
    if (data.id) {
      setContacts(prev => prev.map(c => c.id === data.id ? { ...c, ...data } as Contact : c));
    } else {
      const newContact: Contact = {
        id: String(Date.now()),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        jobTitle: data.jobTitle || '',
        notes: data.notes || '',
        tags: [],
        avatar: (data.name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        createdAt: new Date(),
        lastMeeting: null,
        customFields: {},
      };
      setContacts(prev => [newContact, ...prev]);
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/50'}`} />
    </button>
  );

  // Empty state
  if (!loading && contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No contacts yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">Add your first contact to start managing your network and scheduling meetings.</p>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Contact
        </Button>
        <AddContactModal open={addOpen} onOpenChange={setAddOpen} onSave={handleSaveContact} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3`}>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-3'} flex-1`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Building2 className="h-3.5 w-3.5 mr-1" />
                  {companyFilter || 'Company'}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => { setCompanyFilter(''); setPage(1); }}>All Companies</DropdownMenuItem>
                <DropdownMenuSeparator />
                {companies.map(c => (
                  <DropdownMenuItem key={c} onClick={() => { setCompanyFilter(c); setPage(1); }}>{c}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  {tagFilter || 'Tags'}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => { setTagFilter(''); setPage(1); }}>All Tags</DropdownMenuItem>
                <DropdownMenuSeparator />
                {allTags.map(t => (
                  <DropdownMenuItem key={t} onClick={() => { setTagFilter(t); setPage(1); }} className="capitalize">{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button onClick={() => setAddOpen(true)} className="h-9">
          <Plus className="h-4 w-4 mr-1" /> Add Contact
        </Button>
      </div>

      {/* Active filters */}
      {(companyFilter || tagFilter) && (
        <div className="flex items-center gap-2 flex-wrap">
          {companyFilter && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setCompanyFilter('')}>
              {companyFilter} ×
            </Badge>
          )}
          {tagFilter && (
            <Badge variant="secondary" className="cursor-pointer capitalize" onClick={() => setTagFilter('')}>
              {tagFilter} ×
            </Badge>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && contacts.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <SearchX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold mb-1">No results found</h3>
          <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && filtered.length > 0 && !isMobile && (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[280px]"><SortHeader label="Name" field="name" /></TableHead>
                <TableHead><SortHeader label="Company" field="company" /></TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden xl:table-cell">Tags</TableHead>
                <TableHead><SortHeader label="Last Meeting" field="lastMeeting" /></TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(contact => (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{contact.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{contact.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{contact.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{contact.company}</div>
                      {contact.jobTitle && <div className="text-xs text-muted-foreground">{contact.jobTitle}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{contact.phone}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${tagColors[tag] || ''}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.lastMeeting ? format(contact.lastMeeting, 'MMM d, yyyy') : '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => navigate(`/contacts/${contact.id}`)}>
                          <User className="h-3.5 w-3.5 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShareContact(contact)}>
                          <Share2 className="h-3.5 w-3.5 mr-2" /> Share Availability
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScheduleContact(contact)}>
                          <CalendarPlus className="h-3.5 w-3.5 mr-2" /> Schedule Meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && filtered.length > 0 && isMobile && (
        <div className="space-y-2">
          {paged.map(contact => (
            <div
              key={contact.id}
              onClick={() => navigate(`/contacts/${contact.id}`)}
              className="p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">{contact.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{contact.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{contact.company}{contact.jobTitle ? ` · ${contact.jobTitle}` : ''}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => setShareContact(contact)}>
                      <Share2 className="h-3.5 w-3.5 mr-2" /> Share Availability
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setScheduleContact(contact)}>
                      <CalendarPlus className="h-3.5 w-3.5 mr-2" /> Schedule Meeting
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" /> {contact.email}</span>
                {contact.phone && <span className="flex items-center gap-1 shrink-0"><Phone className="h-3 w-3" /> {contact.phone.slice(0, 15)}</span>}
              </div>
              {contact.tags.length > 0 && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${tagColors[tag] || ''}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {filtered.length} contact{filtered.length !== 1 ? 's' : ''} · Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddContactModal open={addOpen} onOpenChange={setAddOpen} onSave={handleSaveContact} />
      <AddContactModal open={!!editContact} onOpenChange={v => !v && setEditContact(null)} contact={editContact} onSave={handleSaveContact} />
      <ShareAvailabilityModal open={!!shareContact} onOpenChange={v => !v && setShareContact(null)} contact={shareContact} />
      <ScheduleMeetingModal open={!!scheduleContact} onOpenChange={v => !v && setScheduleContact(null)} contact={scheduleContact} />
    </div>
  );
}
