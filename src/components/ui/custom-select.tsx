
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: string;
    type?: 'header' | 'option';
  }>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select option",
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative", className)} ref={selectRef}>
      <button 
        type="button" 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        disabled={disabled} 
        className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-border/60 focus:ring-2 focus:ring-ring bg-background transition-colors h-10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center">
          {selectedOption?.icon && (
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center mr-3">
              <span className="text-primary-foreground text-xs -space-x-1">
                {selectedOption.icon}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">
            {selectedOption?.label || placeholder}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
          {options.map(option => (
            <div key={option.value}>
              {option.type === 'header' ? (
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                  {option.label}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }} 
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-muted transition-colors"
                >
                  {option.icon && <span className="mr-3 text-sm">{option.icon}</span>}
                  <span className="text-sm">{option.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
