import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

// Comprehensive list of useful lucide icons organized by category
// TODO: Move to a different file with lists of all icons available in lucide-react
const iconCategories = {
  Business: [
    'Briefcase', 'Calendar', 'Clock', 'Users', 'User', 'Target', 'TrendingUp', 
    'BarChart3', 'PieChart', 'Building', 'Building2', 'Handshake', 'DollarSign',
    'CreditCard', 'Wallet', 'FileText', 'Folder', 'Archive', 'Bookmark'
  ],
  Communication: [
    'MessageCircle', 'MessageSquare', 'Mail', 'Phone', 'PhoneCall', 'Video',
    'Mic', 'MicOff', 'Speaker', 'Headphones', 'Bell', 'BellRing', 'Share',
    'Send', 'Reply', 'Forward', 'AtSign', 'Hash', 'Megaphone', 'Radio'
  ],
  Technology: [
    'Monitor', 'Smartphone', 'Laptop', 'Tablet', 'HardDrive', 'Server',
    'Database', 'Wifi', 'Bluetooth', 'Code', 'Code2', 'Terminal', 'GitBranch',
    'GitCommit', 'Github', 'Globe', 'Cloud', 'CloudUpload', 'CloudDownload', 'Cpu'
  ],
  Education: [
    'GraduationCap', 'BookOpen', 'Book', 'PenTool', 'Edit', 'FileEdit',
    'School', 'Award', 'Medal', 'Trophy', 'Star', 'Brain', 'Lightbulb',
    'Microscope', 'Calculator', 'Ruler', 'Compass', 'Globe2', 'Library', 'Presentation'
  ],
  Health: [
    'Heart', 'Activity', 'Pulse', 'Stethoscope', 'Pill', 'Cross', 'Shield',
    'ShieldCheck', 'Thermometer', 'Zap', 'Battery', 'Leaf', 'Sun', 'Moon',
    'Eye', 'EyeOff', 'Smile', 'Frown', 'Meh', 'ThumbsUp', 'ThumbsDown'
  ],
  Food: [
    'Coffee', 'Cup', 'Wine', 'Beer', 'IceCream', 'Pizza', 'Apple', 'Cherry',
    'Banana', 'Grape', 'Salad', 'Utensils', 'UtensilsCrossed', 'ChefHat',
    'Cookie', 'Cake', 'Candy', 'Fish', 'Beef', 'Egg'
  ],
  Transportation: [
    'Car', 'Bus', 'Train', 'Plane', 'Ship', 'Bike', 'Truck', 'Taxi',
    'MapPin', 'Map', 'Navigation', 'Compass', 'Route', 'Road', 'ParkingCircle',
    'Fuel', 'CarFront', 'Sailboat', 'Rocket', 'Helicopter'
  ],
  Entertainment: [
    'Music', 'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack', 'Volume2',
    'VolumeOff', 'Camera', 'Film', 'Image', 'Gamepad2', 'Tv', 'Radio',
    'Disc', 'Headphones', 'Mic2', 'Guitar', 'Piano', 'Drum'
  ],
  Tools: [
    'Settings', 'Wrench', 'Hammer', 'Screwdriver', 'Scissors', 'Paperclip',
    'Pin', 'Thumbtack', 'Lock', 'Unlock', 'Key', 'Search', 'Filter',
    'Download', 'Upload', 'RefreshCw', 'RotateCcw', 'RotateCw', 'Shuffle', 'Repeat'
  ],
  Nature: [
    'Tree', 'Flower', 'Leaf', 'Sprout', 'Bug', 'Dog', 'Cat', 'Bird',
    'Fish', 'Rabbit', 'Squirrel', 'Sun', 'Moon', 'Star', 'Cloud',
    'CloudRain', 'CloudSnow', 'Umbrella', 'Rainbow', 'Mountain'
  ]
};

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcon?: string;
  currentColor?: string;
  onSelectIcon: (iconName: string, color: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  isOpen,
  onClose,
  currentIcon = 'Calendar',
  currentColor = '#6366f1',
  onSelectIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customColor, setCustomColor] = useState(currentColor);

  // Get all available icons
  const allIcons = useMemo(() => {
    const iconList: string[] = [];
    Object.values(iconCategories).forEach(categoryIcons => {
      iconList.push(...categoryIcons);
    });
    return [...new Set(iconList)]; // Remove duplicates
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = selectedCategory === 'All' ? allIcons : iconCategories[selectedCategory as keyof typeof iconCategories] || [];
    
    if (searchQuery) {
      icons = icons.filter(iconName => 
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return icons.filter(iconName => iconName in LucideIcons);
  }, [searchQuery, selectedCategory, allIcons]);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleApply = () => {
    onSelectIcon(selectedIcon, selectedColor);
    onClose();
  };

  const handleClose = () => {
    // Reset to current values when closing without applying
    setSelectedIcon(currentIcon);
    setSelectedColor(currentColor);
    setCustomColor(currentColor);
    onClose();
  };

  // Reset when opening
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIcon(currentIcon);
      setSelectedColor(currentColor);
      setCustomColor(currentColor);
      setSearchQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen, currentIcon, currentColor]);

  const categories = ['All', ...Object.keys(iconCategories)];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Choose Icon</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1 border-b border-border pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Icon grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 p-1">
              {filteredIcons.map((iconName) => {
                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
                if (!IconComponent) return null;

                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={`relative h-12 w-12 rounded-lg border-2 transition-all hover:bg-muted flex items-center justify-center group ${
                      selectedIcon === iconName
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent hover:border-muted-foreground/20'
                    }`}
                    title={iconName}
                  >
                    <IconComponent 
                      className="h-5 w-5" 
                      style={{ color: selectedIcon === iconName ? selectedColor : undefined }}
                    />
                    {selectedIcon === iconName && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color picker */}
          <div className="border-t border-border pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Icon Color</h4>

              {/* Custom color input */}
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="h-8 w-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e as any)}
                  placeholder="#6366f1"
                  className="flex-1 px-3 py-1 text-sm border border-border rounded bg-background"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};