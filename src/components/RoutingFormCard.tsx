import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card, CardContent } from './ui/card';
import { MoreHorizontal, Download, Copy, Trash2, Edit, ExternalLink, Clock, Route } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
interface RoutingFormCardProps {
  form: {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    responses: number;
    fields: number;
    routes: number;
    teamName: string;
    createdAt: string;
  };
  onEdit: (formId: string) => void;
  onToggle: (formId: string, enabled: boolean) => void;
  onDownload: (formId: string) => void;
  onDuplicate: (formId: string) => void;
  onDelete: (formId: string) => void;
  onCopyLink: (formId: string) => void;
  copiedLink: string | null;
}
export const RoutingFormCard: React.FC<RoutingFormCardProps> = ({
  form,
  onEdit,
  onToggle,
  onDownload,
  onDuplicate,
  onDelete,
  onCopyLink,
  copiedLink
}) => {
  const [isEnabled, setIsEnabled] = useState(form.enabled);
  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggle(form.id, checked);
  };
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when interacting with controls
    if ((e.target as HTMLElement).closest('.card-controls')) {
      return;
    }
    onEdit(form.id);
  };
  return <div className="bg-card border border-border rounded-lg p-4 hover:border-border/60 transition-all hover:shadow-sm cursor-pointer w-full animate-fade-in" onClick={handleCardClick}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2 space-x-3">
              <h3 className="font-semibold text-foreground text-base">
                {form.title}
              </h3>
              
              {/* URL box with icons */}
              <div className="relative flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                <span>cal.id/forms/{form.id}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={e => {
                    e.stopPropagation();
                    onCopyLink(form.id);
                  }} className="p-1 hover:bg-muted rounded flex items-center justify-center">
                      <Copy className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs rounded-sm" side="bottom" sideOffset={6}>
                    Copy
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={e => {
                    e.stopPropagation();
                    window.open(`https://cal.id/forms/${form.id}`, '_blank');
                  }} className="p-1 hover:bg-muted rounded flex items-center justify-center">
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs rounded-sm" side="bottom" sideOffset={6}>
                    Preview
                  </TooltipContent>
                </Tooltip>
                {copiedLink === form.id && <div className="absolute top-full mt-1 left-1/2 ml-2 px-2 py-1 bg-foreground text-background text-xs rounded animate-fade-in whitespace-nowrap z-50">
                    Copied!
                  </div>}
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{form.description}</p>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded">
                {form.fields} fields
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded">
                {form.routes} routes
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-muted text-foreground text-xs rounded">
                {form.responses} responses
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4 card-controls">
          <Switch checked={isEnabled} onCheckedChange={handleToggle} onClick={e => e.stopPropagation()} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={e => e.stopPropagation()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(form.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(form.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download responses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(form.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(form.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>;
};