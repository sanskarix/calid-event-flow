
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Copy, Eye } from 'lucide-react';

interface RoutingFormEmbedModalProps {
  open: boolean;
  onClose: () => void;
  formId: string;
}

export const RoutingFormEmbedModal: React.FC<RoutingFormEmbedModalProps> = ({
  open,
  onClose,
  formId
}) => {
  const [embedType, setEmbedType] = useState('inline');
  const [theme, setTheme] = useState('auto');
  const [hideEventTypeDetails, setHideEventTypeDetails] = useState(false);
  const [brandColorLight, setBrandColorLight] = useState('007ee5');
  const [brandColorDark, setBrandColorDark] = useState('fafafa');
  const [layout, setLayout] = useState('month');

  const generateEmbedCode = () => {
    const baseUrl = `cal.com/forms/${formId}`;
    
    if (embedType === 'inline') {
      return `<iframe src="${baseUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    } else if (embedType === 'floating-button') {
      return `<script>
  (function (C, A, L) { 
    let p = function (a, ar) { 
      a.q.push(ar); 
    }; 
    let d = C.document; 
    C.Cal = C.Cal || function () { 
      let cal = C.Cal; 
      let ar = arguments; 
      if (!cal.loaded) { 
        cal.ns = {}; 
        cal.q = cal.q || []; 
        d.head.appendChild(d.createElement("script")).src = A; 
        cal.loaded = true; 
      } 
      if (ar[0] === L) { 
        const api = function () { 
          p(api, arguments); 
        }; 
        const namespace = ar[1]; 
        api.q = api.q || []; 
        typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); 
        return; 
      } 
      p(cal, ar); 
    }; 
  })(window, "https://app.cal.com/embed/embed.js", "init"); 
  Cal("init", {origin:"https://cal.com"});
  
  Cal("floatingButton", {
    calLink: "forms/${formId}",
    config: {
      theme: "${theme}",
      layout: "${layout}",
      branding: {
        brandColor: "${brandColorLight}",
        darkBrandColor: "${brandColorDark}"
      }
    }
  });
</script>`;
    } else if (embedType === 'popup') {
      return `<button onclick="openCalPopup()">Open Form</button>
<script>
  function openCalPopup() {
    Cal("modal", {
      calLink: "forms/${formId}",
      config: {
        theme: "${theme}",
        layout: "${layout}",
        branding: {
          brandColor: "${brandColorLight}",
          darkBrandColor: "${brandColorDark}"
        }
      }
    });
  }
</script>`;
    }
    
    return '';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
  };

  const handlePreview = () => {
    window.open(`cal.com/forms/${formId}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Embed Form</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Embed Type Selection */}
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setEmbedType('inline')}
              className={`flex-1 px-6 py-3 border-2 rounded-lg text-center transition-all ${
                embedType === 'inline' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-sm">Inline</span>
            </button>
            <button
              onClick={() => setEmbedType('floating-button')}
              className={`flex-1 px-6 py-3 border-2 rounded-lg text-center transition-all ${
                embedType === 'floating-button' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-sm">Floating Button</span>
            </button>
            <button
              onClick={() => setEmbedType('popup')}
              className={`flex-1 px-6 py-3 border-2 rounded-lg text-center transition-all ${
                embedType === 'popup' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-sm">Pop up</span>
            </button>
          </div>

          <div className="flex gap-8">
            {/* Left side - Configuration */}
            <div className="w-3/5">
              <div className="overflow-x-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                    Embed the form directly into your webpage
                  </p>
                  
                  <div className="space-y-4">
                    {/* Theme Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hide Details Toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-details"
                        checked={hideEventTypeDetails}
                        onCheckedChange={setHideEventTypeDetails}
                      />
                      <label htmlFor="hide-details" className="text-sm">
                        Hide event type details
                      </label>
                    </div>

                    {/* Brand Colors */}
                    <div className="space-y-4 mt-6">
                      <h4 className="font-medium text-sm">Brand Colors</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Brand Color (Light Theme)
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={`#${brandColorLight}`}
                              onChange={(e) => setBrandColorLight(e.target.value.substring(1))}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={brandColorLight}
                              onChange={(e) => setBrandColorLight(e.target.value)}
                              placeholder="007ee5"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Brand Color (Dark Theme)
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={`#${brandColorDark}`}
                              onChange={(e) => setBrandColorDark(e.target.value.substring(1))}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={brandColorDark}
                              onChange={(e) => setBrandColorDark(e.target.value)}
                              placeholder="fafafa"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layout */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">Layout</label>
                      <Select value={layout} onValueChange={setLayout}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Preview and Code */}
            <div className="w-2/5">
              <div className="space-y-4">
                {/* Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Preview</h3>
                    <Button variant="outline" size="sm" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <p className="text-sm text-gray-600">
                          {embedType === 'inline' && 'Inline Form Preview'}
                          {embedType === 'floating-button' && 'Floating Button Preview'}
                          {embedType === 'popup' && 'Pop-up Form Preview'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Theme: {theme} | Layout: {layout}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ready to Embed */}
                <div className="text-center">
                  <h4 className="font-medium text-sm mb-1">Ready to embed?</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Get the code to add to your website
                  </p>
                  <button
                    onClick={handleCopyCode}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Copy className="h-4 w-4 mr-2 inline" />
                    Get Code
                  </button>
                </div>

                {/* Code Preview */}
                <div className="mt-4">
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
