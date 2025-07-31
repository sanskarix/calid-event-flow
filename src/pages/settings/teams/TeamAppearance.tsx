import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';

export const TeamAppearance = () => {
  const { teamId } = useParams();
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [customBrandColors, setCustomBrandColors] = useState(false);
  const [disableBranding, setDisableBranding] = useState(false);
  const [hideBookButton, setHideBookButton] = useState(false);
  const [lightBrandColor, setLightBrandColor] = useState('#007ee5');
  const [darkBrandColor, setDarkBrandColor] = useState('#fafafa');

  const themes = [
    {
      id: 'system',
      name: 'System default',
      preview: '/api/placeholder/120/80'
    },
    {
      id: 'light',
      name: 'Light',
      preview: '/api/placeholder/120/80'
    },
    {
      id: 'dark',
      name: 'Dark',
      preview: '/api/placeholder/120/80'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="py-4 w-full">
        <div className="space-y-8">
          {/* Booking page theme */}
          <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Booking page theme</h3>
                <p className="text-sm text-muted-foreground">This only applies to your public booking pages</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div key={theme.id} className="space-y-2">
                    <button
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`w-full aspect-[3/2] border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                        selectedTheme === theme.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-muted hover:border-muted-foreground'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded shadow-sm"></div>
                      </div>
                    </button>
                    <p className="text-sm text-center font-medium">{theme.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button className="hover:scale-105 transition-transform duration-200">Save</Button>
              </div>
            </div>
          </div>

          {/* Custom brand colors */}
          <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Custom brand colors</h3>
                  <p className="text-sm text-muted-foreground">Customize your own brand colour into your booking page.</p>
                </div>
                <Switch
                  checked={customBrandColors}
                  onCheckedChange={setCustomBrandColors}
                  className="transition-all duration-200"
                />
              </div>

              {customBrandColors && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <Label htmlFor="light-brand-color">Brand Color (Light Theme)</Label>
                    <div className="flex space-x-3">
                      <div className="w-12 h-10 rounded border overflow-hidden">
                        <input
                          type="color"
                          value={lightBrandColor}
                          onChange={(e) => setLightBrandColor(e.target.value)}
                          className="w-full h-full border-none cursor-pointer"
                        />
                      </div>
                      <Input
                        id="light-brand-color"
                        value={lightBrandColor}
                        onChange={(e) => setLightBrandColor(e.target.value)}
                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dark-brand-color">Brand Color (Dark Theme)</Label>
                    <div className="flex space-x-3">
                      <div className="w-12 h-10 rounded border overflow-hidden">
                        <input
                          type="color"
                          value={darkBrandColor}
                          onChange={(e) => setDarkBrandColor(e.target.value)}
                          className="w-full h-full border-none cursor-pointer"
                        />
                      </div>
                      <Input
                        id="dark-brand-color"
                        value={darkBrandColor}
                        onChange={(e) => setDarkBrandColor(e.target.value)}
                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disable OneHash Cal branding */}
          <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Disable OneHash Cal branding</h3>
                <p className="text-sm text-muted-foreground">Removes any OneHash Cal related brandings, i.e. "Powered by OneHash Cal."</p>
              </div>
              <Switch
                checked={disableBranding}
                onCheckedChange={setDisableBranding}
                className="transition-all duration-200"
              />
            </div>
          </div>

          {/* Hide Book a Team Member Button */}
          <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Hide Book a Team Member Button</h3>
                <p className="text-sm text-muted-foreground">Hide Book a Team Member Button from your public pages.</p>
              </div>
              <Switch
                checked={hideBookButton}
                onCheckedChange={setHideBookButton}
                className="transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
