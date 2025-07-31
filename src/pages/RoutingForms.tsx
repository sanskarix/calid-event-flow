import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Route, Plus, ChevronDown, Copy, ExternalLink, Download, Code } from 'lucide-react';
import { CreateRoutingFormModal } from '../components/CreateRoutingFormModal';
import { Switch } from '../components/ui/switch';
import { RoutingFormEmbedModal } from '../components/RoutingFormEmbedModal';
import { RoutingFormCard } from '../components/RoutingFormCard';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';
export const RoutingForms = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [selectedEmbedFormId, setSelectedEmbedFormId] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [routingForms, setRoutingForms] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  useEffect(() => {
    setHeaderMeta({
      title: 'Routing Forms',
      description: 'Create forms to direct attendees to the correct destinations',
    });
  }, [setHeaderMeta]);

  // Load teams from localStorage
  useEffect(() => {
    const personalTeam = {
      id: 'personal',
      name: 'Your account',
      avatar: 'S'
    };
    const savedTeams = localStorage.getItem('teams');
    const loadedTeams = savedTeams ? JSON.parse(savedTeams) : [];

    // Add 4 example teams for demonstration
    const exampleTeams = [{
      id: 'team1',
      name: 'Marketing Team',
      avatar: 'M'
    }, {
      id: 'team2',
      name: 'Sales Team',
      avatar: 'S'
    }, {
      id: 'team3',
      name: 'Development Team',
      avatar: 'D'
    }, {
      id: 'team4',
      name: 'Support Team',
      avatar: 'Su'
    }];
    setTeams([personalTeam, ...loadedTeams.map((team: any) => ({
      ...team,
      name: team.name
    })), ...exampleTeams]);
  }, []);

  // Load sample forms
  useEffect(() => {
    const sampleForms = [{
      id: 'form-1',
      title: 'Customer Support Routing',
      description: 'Route customers to the right support team based on their issue type',
      enabled: true,
      responses: 45,
      fields: 5,
      routes: 3,
      teamName: 'Support Team',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      id: 'form-2',
      title: 'Sales Qualification Form',
      description: 'Qualify leads and route them to appropriate sales representatives',
      enabled: true,
      responses: 23,
      fields: 4,
      routes: 2,
      teamName: 'Sales Team',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      id: 'form-3',
      title: 'Marketing Campaign Routing',
      description: 'Route prospects based on their interest and campaign source',
      enabled: false,
      responses: 12,
      fields: 6,
      routes: 4,
      teamName: 'Marketing Team',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      id: 'form-4',
      title: 'Technical Support Triage',
      description: 'Categorize and route technical support requests to specialized teams',
      enabled: true,
      responses: 67,
      fields: 7,
      routes: 5,
      teamName: 'Development Team',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      id: 'form-5',
      title: 'Product Demo Requests',
      description: 'Route product demonstration requests to appropriate sales engineers',
      enabled: true,
      responses: 31,
      fields: 4,
      routes: 3,
      teamName: 'Sales Team',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      id: 'form-6',
      title: 'Partnership Inquiries',
      description: 'Filter and route partnership and integration requests',
      enabled: false,
      responses: 8,
      fields: 5,
      routes: 2,
      teamName: 'Marketing Team',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }];
    setRoutingForms(sampleForms);
  }, []);
  const handleFormCreated = (form: any) => {
    const newForm = {
      ...form,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString(),
      enabled: true,
      responses: 0,
      fields: 0,
      routes: 0
    };
    setRoutingForms(prev => [...prev, newForm]);
  };
  const handleSave = () => {
    // Save functionality - in a real app, this would save to backend
    console.log('Saving routing forms...');
    // Show success message or toast
  };
  const handleFormEdit = (formId: string) => {
    navigate(`/routing-forms/${formId}/edit`);
  };
  const handleFormToggle = (formId: string, enabled: boolean) => {
    setRoutingForms(prev => prev.map(form => form.id === formId ? {
      ...form,
      enabled
    } : form));
  };
  const handleFormDownload = (formId: string) => {
    console.log('Downloading responses for form:', formId);
  };
  const handleFormDuplicate = (formId: string) => {
    const formToDuplicate = routingForms.find(f => f.id === formId);
    if (formToDuplicate) {
      const duplicatedForm = {
        ...formToDuplicate,
        id: `form-${Date.now()}`,
        title: `${formToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        responses: 0
      };
      setRoutingForms(prev => [...prev, duplicatedForm]);
    }
  };
  const handleFormDelete = (formId: string) => {
    setRoutingForms(prev => prev.filter(form => form.id !== formId));
  };
  const handleCopyLink = (formId: string) => {
    navigator.clipboard.writeText(`https://cal.id/forms/${formId}`);
    setCopiedLink(formId);
    setTimeout(() => setCopiedLink(null), 2000);
  };
  const handleEmbedClick = (formId: string) => {
    setSelectedEmbedFormId(formId);
    setShowEmbedModal(true);
  };
  const getFilteredTeams = () => {
    const allOption = {
      id: 'all',
      name: 'All',
      avatar: '',
      checked: selectedTeamFilter === 'all'
    };
    const teamOptions = teams.map(team => ({
      ...team,
      checked: selectedTeamFilter === team.id
    }));
    return [allOption, ...teamOptions];
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      

      <div className="px-8 py-6">
        {routingForms.length === 0 ?
      // Empty state
      <div className="max-w-6xl mx-auto">
            {/* Teams Filter Dropdown */}
            <div className="mb-8">
              <div className="relative inline-block">
                <button onClick={() => setShowTeamDropdown(!showTeamDropdown)} className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                  <span>Teams: All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showTeamDropdown && <div className="absolute top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {getFilteredTeams().map(team => <button key={team.id} onClick={() => {
                  setSelectedTeamFilter(team.id);
                  setShowTeamDropdown(false);
                }} className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors">
                          <div className="flex items-center">
                            {team.id === 'all' ? <div className="h-5 w-5 mr-2" /> : <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-2">
                                {team.avatar}
                              </div>}
                            <span>{team.name}</span>
                          </div>
                          {team.checked && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </button>)}
                    </div>
                  </div>}
              </div>
            </div>

            {/* Empty State Content */}
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-8">
                <Route className="h-16 w-16 text-muted-foreground" />
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Create your first form</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                With Routing Forms you can ask qualifying questions and route to the correct person or event type.
              </p>
              
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div> :
      // Forms display
      <div className="pb-6 space-y-4 w-full max-w-full">
            {/* Teams Filter and New Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <button onClick={() => setShowTeamDropdown(!showTeamDropdown)} className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                  <span>Teams: All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showTeamDropdown && <div className="absolute top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {getFilteredTeams().map(team => <button key={team.id} onClick={() => {
                  setSelectedTeamFilter(team.id);
                  setShowTeamDropdown(false);
                }} className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors">
                          <div className="flex items-center">
                            {team.id === 'all' ? <div className="h-5 w-5 mr-2" /> : <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-2">
                                {team.avatar}
                              </div>}
                            <span>{team.name}</span>
                          </div>
                          {team.checked && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </button>)}
                    </div>
                  </div>}
              </div>

              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>

            {/* Forms List - Single Column */}
            <div className="space-y-4">
              {routingForms.map(form => <RoutingFormCard key={form.id} form={form} onEdit={handleFormEdit} onToggle={handleFormToggle} onDownload={handleFormDownload} onDuplicate={handleFormDuplicate} onDelete={handleFormDelete} onCopyLink={handleCopyLink} copiedLink={copiedLink} />)}
            </div>
          </div>}

        <CreateRoutingFormModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onFormCreated={handleFormCreated} teams={teams} />

        <RoutingFormEmbedModal open={showEmbedModal} onClose={() => setShowEmbedModal(false)} formId={selectedEmbedFormId} />
      </div>
    </div>;
};