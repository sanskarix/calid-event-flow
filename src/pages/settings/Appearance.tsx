
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Appearance = () => {
  const [customBrandColors, setCustomBrandColors] = useState(true);
  const [disableBranding, setDisableBranding] = useState(false);
  const [lightBrandColor, setLightBrandColor] = useState('#007ee5');
  const [darkBrandColor, setDarkBrandColor] = useState('#fafafa');
  const [selectedDashboardTheme, setSelectedDashboardTheme] = useState('light');
  const [selectedBookingTheme, setSelectedBookingTheme] = useState('system');
  const [selectedDefaultView, setSelectedDefaultView] = useState('month');
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  const [monthLayout, setMonthLayout] = useState(true);
  const [weeklyLayout, setWeeklyLayout] = useState(true);
  const [columnLayout, setColumnLayout] = useState(true);

  const dashboardThemes = [
    { name: 'System default', value: 'system', image: '/lovable-uploads/a8e28b12-738b-4efc-9df1-2dd1f74ac700.png' },
    { name: 'Light', value: 'light', image: '/lovable-uploads/b13e98ea-babf-46f1-aa8b-baa185c0abc6.png' },
    { name: 'Dark', value: 'dark', image: '/lovable-uploads/ecf7a7ec-1451-4b44-b98a-48162cd21bac.png' }
  ];

  const bookingThemes = [
    { name: 'System default', value: 'system', image: '/lovable-uploads/a8e28b12-738b-4efc-9df1-2dd1f74ac700.png' },
    { name: 'Light', value: 'light', image: '/lovable-uploads/b13e98ea-babf-46f1-aa8b-baa185c0abc6.png' },
    { name: 'Dark', value: 'dark', image: '/lovable-uploads/708c852c-2d28-4573-a68e-616ffc467d12.png' }
  ];

  const layoutOptions = [
    { 
      name: 'Month', 
      value: 'month',
      image: '/lovable-uploads/d0414c98-7283-4f05-b72b-7198ab2fede9.png',
      checked: monthLayout, 
      onChange: (checked: boolean | "indeterminate") => setMonthLayout(checked === true)
    },
    { 
      name: 'Weekly', 
      value: 'weekly',
      image: '/lovable-uploads/f644dcee-fe24-4582-a17b-c89185f20bb0.png',
      checked: weeklyLayout, 
      onChange: (checked: boolean | "indeterminate") => setWeeklyLayout(checked === true)
    },
    { 
      name: 'Column', 
      value: 'column',
      image: '/lovable-uploads/a8e28b12-738b-4efc-9df1-2dd1f74ac700.png',
      checked: columnLayout, 
      onChange: (checked: boolean | "indeterminate") => setColumnLayout(checked === true)
    }
  ];

  const defaultViewOptions = [
    { name: 'Month', value: 'month', enabled: monthLayout },
    { name: 'Weekly', value: 'weekly', enabled: weeklyLayout },
    { name: 'Column', value: 'column', enabled: columnLayout }
  ];

  useEffect(() => {
    setHeaderMeta({
      title: 'Appearance',
      description: 'Manage settings for your booking appearance.',
    });
  }, [setHeaderMeta]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className="space-y-8">
          {/* Dashboard theme */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-2">Dashboard theme</h2>
                  <p className="text-sm text-muted-foreground">This only applies to your logged in dashboard</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {dashboardThemes.map((theme, index) => (
                    <div 
                      key={index} 
                      className={`border-2 rounded-lg p-4 cursor-pointer ${selectedDashboardTheme === theme.value ? 'border-primary' : 'border-border'}`}
                      onClick={() => setSelectedDashboardTheme(theme.value)}
                    >
                      <div className="w-full h-24 rounded mb-2 overflow-hidden">
                        <img src={theme.image} alt={theme.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-center">{theme.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Booking page theme */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-2">Booking page theme</h2>
                  <p className="text-sm text-muted-foreground">This only applies to your public booking pages</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {bookingThemes.map((theme, index) => (
                    <div 
                      key={index} 
                      className={`border-2 rounded-lg p-4 cursor-pointer ${selectedBookingTheme === theme.value ? 'border-primary' : 'border-border'}`}
                      onClick={() => setSelectedBookingTheme(theme.value)}
                    >
                      <div className="w-full h-20 rounded mb-2 overflow-hidden">
                        <img src={theme.image} alt={theme.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-center">{theme.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking layout */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-2">Booking layout</h2>
                  <p className="text-sm text-muted-foreground">
                    You can select multiple and bookers can switch views. This can be overridden on a per event basis.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {layoutOptions.map((layout, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="w-full h-16 rounded mb-2 overflow-hidden">
                        <img src={layout.image} alt={layout.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={layout.checked}
                          onCheckedChange={layout.onChange}
                        />
                        <span className="text-sm">{layout.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label className="text-sm font-medium">Default view</Label>
                  <div className="flex space-x-2 mt-2">
                    {defaultViewOptions.map((option) => (
                      <Button 
                        key={option.value}
                        variant={selectedDefaultView === option.value ? "default" : "outline"} 
                        size="sm"
                        disabled={!option.enabled}
                        onClick={() => setSelectedDefaultView(option.value)}
                      >
                        {option.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom brand colors */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium">Custom brand colors</h2>
                    <p className="text-sm text-muted-foreground">Customize your own brand colour into your booking page.</p>
                  </div>
                  <Switch 
                    checked={customBrandColors}
                    onCheckedChange={setCustomBrandColors}
                  />
                </div>

                {customBrandColors && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Brand Color (Light Theme)</Label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          value={lightBrandColor}
                          onChange={(e) => setLightBrandColor(e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                        <Input 
                          value={lightBrandColor}
                          onChange={(e) => setLightBrandColor(e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Brand Color (Dark Theme)</Label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          value={darkBrandColor}
                          onChange={(e) => setDarkBrandColor(e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                        <Input 
                          value={darkBrandColor}
                          onChange={(e) => setDarkBrandColor(e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Other settings */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-medium">Disable branding</h2>
                    <p className="text-sm text-muted-foreground">Removes any OneHash related brandings, i.e. 'Powered by OneHash.'</p>
                  </div>
                  <Switch 
                    checked={disableBranding}
                    onCheckedChange={setDisableBranding}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-medium">Custom brand logo</h2>
                      <p className="text-sm text-muted-foreground">Add your own brand logo into your booking page.</p>
                    </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Preview</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Brand Logo Preview</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center p-8">
                            <img 
                              src="https://cdn.prod.website-files.com/5e53d34464688e6f5960a338/610a36c2792530d601aaf35f_OneHash_Logo.svg" 
                              alt="OneHash Logo Preview" 
                              className="max-w-full max-h-32 object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://cdn.prod.website-files.com/5e53d34464688e6f5960a338/610a36c2792530d601aaf35f_OneHash_Logo.svg" 
                        alt="OneHash Logo" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-medium">Custom brand favicon</h2>
                    <p className="text-sm text-muted-foreground">Add your own brand favicon into your booking page.</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://cdn.prod.website-files.com/5e53d34464688e6f5960a338/65d0f96d6759233ecabe6ea5_OneHash.svg" 
                        alt="OneHash Favicon" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload favicon
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
};
