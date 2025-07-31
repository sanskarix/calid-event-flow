import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, Moon, HelpCircle, MapPin, LogOut, User, Settings,
  FileIcon, Mail, ArrowLeft,
  Edit,
  Delete,
  Trash2
} from 'lucide-react';
import { Switch } from './ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface HeaderMeta {
  title: string;
  description?: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  onTitleChange?: (title: string) => void;
}

interface HeaderProps {
  metaData: HeaderMeta;
}

export const Header = ({ metaData }: HeaderProps) => {
  // Defensive check to ensure metaData is defined
  if (!metaData) {
    return null;
  }
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
        setShowHelpDropdown(false);
      }
    };

    if (showProfileDropdown || showHelpDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showHelpDropdown]);

  const handleHelpClick = (action: string) => {
    setShowHelpDropdown(false);
    setShowProfileDropdown(false);
    switch (action) {
      case 'docs':
        window.open('https://docs.cal.id', '_blank');
        break;
      case 'contact':
        window.location.href = 'mailto:support@cal.id';
        break;
    }
  };

  const handleHelpAndSupportClick = () => {
    setShowProfileDropdown(false);
    setShowHelpDropdown(true);
  };

  return (
    <header className="h-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="h-full px-8 flex items-center justify-between w-full">
        {/* Left section: Back button, title, and optional description */}
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex items-center space-x-4">
            {metaData && metaData.enabled !== undefined && (
              <button
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="flex items-center text-xl font-semibold text-foreground">
                {metaData.title}
                { metaData.onTitleChange && <Edit
                  className='h-4 w-4 ml-1'
                  onClick={() => metaData.onTitleChange && metaData.onTitleChange(metaData.title)}
                />}
              </h1>
              {metaData.description && (
                <p className="text-sm text-muted-foreground">
                  {metaData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right section: Toggle, Save, Profile */}
        <div className="flex items-center space-x-2 ml-auto">
          {metaData && metaData.enabled !== undefined && metaData.onEnabledChange && (
            <>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex items-center'>
                      <Switch
                        checked={metaData.enabled}
                        onCheckedChange={metaData.onEnabledChange}
                        className='self-center'
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {metaData.enabled ? "Disable" : "Enable"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center">
                <button
                  onClick={() => console.log('Save clicked')}
                  className="px-3 py-1 text-sm border-l border-t border-b rounded-l-md font-medium hover:bg-secondary transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => console.log('Save clicked')}
                  className="px-3 py-1 text-sm border rounded-r-md font-medium hover:bg-secondary transition-colors"
                >
                  Save
                </button>
              </div>
              <div className="w-px h-6 bg-border" />
            </>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 rounded-lg transition-colors w-full"
            >
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">SY</span>
              </div>
              <span className="text-sm font-medium text-foreground">Sanskar Yadav</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg animate-scale-in z-10">
                <div className="py-1">
                  <button onClick={() => window.location.href = '/settings/profile'} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <User className="h-4 w-4 mr-2" /> My Profile
                  </button>
                  <button onClick={() => window.location.href = '/settings/out-of-office'} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Moon className="h-4 w-4 mr-2" /> Out of Office
                  </button>
                  <button onClick={() => window.open('https://roadmap.onehash.ai/', '_blank')} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <MapPin className="h-4 w-4 mr-2" /> Roadmap
                  </button>
                  <button onClick={handleHelpAndSupportClick} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <HelpCircle className="h-4 w-4 mr-2" /> Help & Support
                  </button>
                  <div className="border-t border-border my-1" />
                  <button onClick={() => window.location.href = '/settings'} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            )}

            {showHelpDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg animate-scale-in z-20">
                <div className="py-1">
                  <button onClick={() => handleHelpClick('docs')} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <FileIcon className="h-4 w-4 mr-2" /> Documentation
                  </button>
                  <button onClick={() => handleHelpClick('contact')} className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Mail className="h-4 w-4 mr-2" /> Contact Us
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
