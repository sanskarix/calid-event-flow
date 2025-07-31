import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Link, MapPin, Plus, X, Clock, Settings, Copy, ExternalLink, Code, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from './ui/switch';
import { CustomSelect } from './ui/custom-select';

interface EventSetupProps {
  onChange?: () => void;
}

export const EventSetup = ({
  onChange
}: EventSetupProps) => {
  const [formData, setFormData] = useState({
    title: 'Product Hunt Chats',
    description: 'The essence of Product Hunt reflects in communities- Select a time suitable for you, and let\'s talk products!',
    url: 'product-hunt-chats',
    durations: ['15', '30', '45', '60'],
    defaultDuration: '15',
    allowBookerToSelectDuration: true,
    location: 'google-meet',
    customDuration: '',
    showCustomDuration: false,
    durationInput: '',
    showDurationDropdown: false
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    meetingLink: '',
    address: '',
    phone: '',
    displayPhone: false,
    googleMapsLink: '',
    showGoogleMaps: false
  });

  const availableDurations = ['5', '10', '15', '20', '25', '30', '45', '50', '60', '75', '80', '90', '120'];
  const durationDropdownRef = useRef<HTMLDivElement>(null);

  const locationOptions = [{
    value: 'conferencing',
    label: 'Conferencing',
    type: 'header' as const
  }, {
    value: 'zoom',
    label: 'Zoom',
    type: 'option' as const,
    icon: '🎥'
  }, {
    value: 'google-meet',
    label: 'Google Meet',
    type: 'option' as const,
    icon: 'GM'
  }, {
    value: 'teams',
    label: 'Microsoft Teams',
    type: 'option' as const,
    icon: 'MT'
  }, {
    value: 'facetime',
    label: 'FaceTime',
    type: 'option' as const,
    icon: '📞'
  }, {
    value: 'phone',
    label: 'Phone',
    type: 'header' as const
  }, {
    value: 'attendee-phone',
    label: 'Attendee phone number',
    type: 'option' as const,
    icon: '📱'
  }, {
    value: 'organizer-phone',
    label: 'Organizer phone number',
    type: 'option' as const,
    icon: '☎️'
  }, {
    value: 'others',
    label: 'Others',
    type: 'header' as const
  }, {
    value: 'link-meeting',
    label: 'Link meeting',
    type: 'option' as const,
    icon: '🔗'
  }, {
    value: 'attendee-location',
    label: 'Custom attendee location',
    type: 'option' as const,
    icon: '📍'
  }, {
    value: 'in-person',
    label: 'In Person',
    type: 'option' as const,
    icon: '🏢'
  }];

  const defaultDurationOptions = formData.durations.map(duration => ({
    value: duration,
    label: `${duration} mins`
  }));

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    onChange?.();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://cal.id/sanskar/${formData.url}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  const handlePreviewUrl = () => {
    window.open(`https://cal.id/sanskar/${formData.url}`, '_blank');
  };

  const addDuration = (duration: string) => {
    if (duration && !formData.durations.includes(duration)) {
      handleFormChange('durations', [...formData.durations, duration]);
      setFormData(prev => ({
        ...prev,
        showDurationDropdown: false
      }));
    }
  };

  const removeDuration = (duration: string) => {
    const newDurations = formData.durations.filter(d => d !== duration);
    handleFormChange('durations', newDurations);
  };

  const getRecommendedDurations = () => {
    return availableDurations.filter(duration => !formData.durations.includes(duration));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target as Node)) {
        setFormData(prev => ({
          ...prev,
          showDurationDropdown: false
        }));
      }
    };
    if (formData.showDurationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formData.showDurationDropdown]);

  const renderLocationDetails = () => {
    if (['zoom', 'facetime', 'link-meeting'].includes(formData.location)) {
      return (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <label className="block text-sm font-medium text-foreground mb-2">Meeting Link</label>
          <input 
            type="url" 
            value={locationDetails.meetingLink} 
            onChange={e => setLocationDetails(prev => ({
              ...prev,
              meetingLink: e.target.value
            }))} 
            placeholder="https://zoom.us/j/..." 
            className="w-full px-3 py-2 border border-border rounded-lg bg-background h-10" 
          />
        </div>
      );
    }
    
    if (formData.location === 'in-person') {
      return (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Address</label>
            <textarea 
              value={locationDetails.address} 
              onChange={e => setLocationDetails(prev => ({
                ...prev,
                address: e.target.value
              }))} 
              placeholder="Enter the meeting address..." 
              rows={3} 
              className="w-full px-3 py-2 border border-border rounded-lg  bg-background" 
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="maps-link" 
                checked={locationDetails.showGoogleMaps} 
                onChange={e => setLocationDetails(prev => ({
                  ...prev,
                  showGoogleMaps: e.target.checked
                }))} 
                className="mr-2" 
              />
              <label htmlFor="maps-link" className="text-sm text-muted-foreground">Include Maps link</label>
            </div>
            {locationDetails.showGoogleMaps && (
              <div className="animate-fade-in">
                <input 
                  type="url" 
                  value={locationDetails.googleMapsLink} 
                  onChange={e => setLocationDetails(prev => ({
                    ...prev,
                    googleMapsLink: e.target.value
                  }))} 
                  placeholder="https://maps.google.com/..." 
                  className="w-full px-3 py-2 border border-border rounded-lg  bg-background h-10" 
                />
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (formData.location === 'organizer-phone') {
      return (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={locationDetails.phone} 
              onChange={e => setLocationDetails(prev => ({
                ...prev,
                phone: e.target.value
              }))} 
              placeholder="+1 (555) 000-0000" 
              className="w-full px-3 py-2 border border-border rounded-lg  bg-background h-10" 
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="display-phone" 
              checked={locationDetails.displayPhone} 
              onChange={e => setLocationDetails(prev => ({
                ...prev,
                displayPhone: e.target.checked
              }))} 
              className="mr-2" 
            />
            <label htmlFor="display-phone" className="text-sm text-muted-foreground">
              Display phone number on booking page
            </label>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-0 max-w-none mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => handleFormChange('title', e.target.value)}
          className="w-full px-2 py-3 border border-border rounded-lg bg-background text-sm text-gray-600 h-10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <div className="border border-border rounded-lg bg-background">
          <div className="flex items-center space-x-2 p-3 border-b border-border">
            <button className="p-2 hover:bg-muted rounded transition-colors" onClick={() => document.execCommand('bold')}>
              <Bold className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" onClick={() => document.execCommand('italic')}>
              <Italic className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="relative">
              <button className="p-2 hover:bg-muted rounded transition-colors" onClick={() => setShowLinkInput(!showLinkInput)}>
                <Link className="h-4 w-4 text-muted-foreground" />
              </button>
              {showLinkInput && (
                <div className="absolute top-full left-0 mt-1 p-3 bg-popover border border-border rounded-lg shadow-lg z-50 w-64 animate-in fade-in-0 zoom-in-95 duration-200">
                  <input 
                    type="url" 
                    placeholder="Enter URL" 
                    value={linkUrl} 
                    onChange={e => setLinkUrl(e.target.value)} 
                    className="w-full px-3 py-2 border border-border rounded mb-2 text-sm text-gray-600 bg-background h-10" 
                    autoFocus 
                  />
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setShowLinkInput(false)} 
                      className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (linkUrl) {
                          document.execCommand('createLink', false, linkUrl);
                          setShowLinkInput(false);
                          setLinkUrl('');
                        }
                      }} 
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div 
            contentEditable 
            className="w-full p-4 min-h-[100px] focus:outline-none text-sm text-gray-600" 
            dangerouslySetInnerHTML={{ __html: formData.description }} 
            onInput={e => handleFormChange('description', e.currentTarget.innerHTML)} 
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Switch id="translate" />
            <label htmlFor="translate" className="text-sm text-gray-600">
              Translate description to the visitor's browser language using AI
            </label>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <label className="block text-sm font-medium text-gray-600">URL</label>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-4 py-3 border border-r-0 border-border bg-muted text-muted-foreground text-sm rounded-l-lg h-10">
            cal.id/sanskar/
          </span>
          <input
            type="text"
            value={formData.url}
            onChange={e => handleFormChange('url', e.target.value)}
            className="flex-1 px-4 py-3 border border-border  bg-background text-sm text-gray-600 h-10"
          />
          <div className="flex items-center border border-l-0 border-border rounded-r-lg bg-background h-10">
            <button 
              onClick={handleCopyUrl} 
              title="Copy URL" 
              className="p-3.5 transition-colors border-r border-border bg-[#f1f5f9] hover:bg-[#f1f5f9]/80 rounded-none h-10 flex items-center justify-center"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={handlePreviewUrl} 
              className="p-3 hover:bg-muted transition-colors rounded-r-lg bg-[#f1f5f9] hover:bg-[#f1f5f9]/80 h-10 flex items-center justify-center" 
              title="Preview"
            >
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {copiedUrl && (
            <div className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded ml-2 z-10">
              Copied!
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Available durations</label>
        <div className="relative" ref={durationDropdownRef}>
          <div 
            className="w-full min-h-[40px] px-3 py-2 border border-border rounded-lg focus-within:ring-2 focus-within:ring-ring bg-background cursor-text flex flex-wrap items-center gap-2" 
            onClick={() => setFormData(prev => ({ ...prev, showDurationDropdown: !prev.showDurationDropdown }))}
          >
            {formData.durations.map(duration => (
              <span key={duration} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded border">
                {duration} mins
                <button 
                  onClick={e => {
                    e.stopPropagation();
                    removeDuration(duration);
                  }} 
                  className="ml-1 text-gray-500 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {formData.durations.length === 0 && (
              <span className="text-gray-400 text-sm">Select durations...</span>
            )}
            
            <div className="ml-auto">
              {formData.showDurationDropdown ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              )}
            </div>
          </div>
          
          {formData.showDurationDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
              {getRecommendedDurations().map(duration => (
                <button 
                  key={duration} 
                  onClick={() => addDuration(duration)} 
                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors"
                >
                  {duration} mins
                </button>
              ))}
              {getRecommendedDurations().length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No more duration options
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default duration</label>
        <CustomSelect 
          value={formData.defaultDuration} 
          onValueChange={value => handleFormChange('defaultDuration', value)} 
          options={defaultDurationOptions} 
          placeholder="Select default duration" 
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="allowBookerToSelectDuration" 
              checked={formData.allowBookerToSelectDuration} 
              onCheckedChange={value => handleFormChange('allowBookerToSelectDuration', value)} 
            />
            <label htmlFor="allowBookerToSelectDuration" className="text-sm text-gray-600">
              Allow booker to select duration
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <CustomSelect 
          value={formData.location} 
          onValueChange={value => handleFormChange('location', value)} 
          options={locationOptions} 
          placeholder="Select location" 
        />
        
        {renderLocationDetails()}
        
        <p className="text-sm text-muted-foreground mt-2">
          Can't find the right conferencing app? Visit our{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-colors">App Store</a>.
        </p>
      </div>
    </div>
  );
};
