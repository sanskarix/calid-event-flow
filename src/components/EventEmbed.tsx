import React, { useState } from 'react';
import { Copy, Eye } from 'lucide-react';
import { Switch } from './ui/switch';
import { CustomSelect } from './ui/custom-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
export const EventEmbed = () => {
  const [embedType, setEmbedType] = useState('inline');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [embedSettings, setEmbedSettings] = useState({
    theme: 'auto',
    hideEventTypeDetails: false,
    lightBrandColor: '007ee5',
    darkBrandColor: 'fafafa',
    layout: 'month',
    buttonText: 'Book my Cal',
    displayCalendarIcon: true,
    position: 'bottom-right',
    buttonColor: '000000',
    textColor: '000000',
    windowWidth: '100',
    windowHeight: '100'
  });
  const themeOptions = [{
    value: 'auto',
    label: 'Auto'
  }, {
    value: 'light',
    label: 'Light'
  }, {
    value: 'dark',
    label: 'Dark'
  }];
  const layoutOptions = [{
    value: 'month',
    label: 'Month'
  }, {
    value: 'week',
    label: 'Week'
  }, {
    value: 'column',
    label: 'Column'
  }];
  const positionOptions = [{
    value: 'bottom-right',
    label: 'Bottom right'
  }, {
    value: 'bottom-left',
    label: 'Bottom left'
  }, {
    value: 'top-right',
    label: 'Top right'
  }, {
    value: 'top-left',
    label: 'Top left'
  }];
  const handleSettingChange = (key: string, value: any) => {
    setEmbedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const generateEmbedCode = (type: 'html' | 'react') => {
    if (type === 'react') {
      switch (embedType) {
        case 'inline':
          return `import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function MyApp() {
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        "theme": "${embedSettings.theme}",
        "styles": {"branding":{"brandColor":"#${embedSettings.lightBrandColor}"}},
        "hideEventTypeDetails": ${embedSettings.hideEventTypeDetails}
      });
    })();
  }, [])

  return <Cal
    calLink="sanskar/product-hunt-chats"
    style={{width:"100%",height:"600px",overflow:"scroll"}}
    config={{"layout":"${embedSettings.layout}"}}
  />;
};`;
        case 'floating':
          return `import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function MyApp() {
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi();
      cal("floatingButton", {
        calLink: "sanskar/product-hunt-chats",
        config: {
          theme: "${embedSettings.theme}"
        }
      });
    })();
  }, [])

  return null;
};`;
        case 'popup':
          return `import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function MyApp() {
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi();
      cal("init", {
        origin: "https://cal.com"
      });
    })();
  }, [])

  return <button 
    data-cal-link="sanskar/product-hunt-chats"
    data-cal-config='{"theme":"${embedSettings.theme}"}'
  >
    ${embedSettings.buttonText}
  </button>;
};`;
        case 'email':
          return `// For email, use HTML format as React components aren't supported in emails`;
        default:
          return '';
      }
    } else {
      switch (embedType) {
        case 'inline':
          return `<iframe 
  src="https://cal.com/sanskar/product-hunt-chats?theme=${embedSettings.theme}&layout=${embedSettings.layout}" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>`;
        case 'floating':
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

  Cal("init", {
    origin: "https://cal.com"
  });

  Cal("floatingButton", {
    calLink: "sanskar/product-hunt-chats",
    config: {
      theme: "${embedSettings.theme}"
    }
  });
</script>`;
        case 'popup':
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

  Cal("init", {
    origin: "https://cal.com"
  });
</script>

<button 
  data-cal-link="sanskar/product-hunt-chats" 
  data-cal-config='{"theme":"${embedSettings.theme}"}'>
  ${embedSettings.buttonText}
</button>`;
        case 'email':
          return `<a href="https://cal.com/sanskar/product-hunt-chats?theme=${embedSettings.theme}" 
   style="display: inline-block; 
          padding: 12px 24px; 
          background-color: #${embedSettings.buttonColor}; 
          color: #${embedSettings.textColor}; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 500;">
  ${embedSettings.buttonText}
</a>`;
        default:
          return '';
      }
    }
  };
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };
  const renderPreview = () => {
    switch (embedType) {
      case 'inline':
        return <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-sm text-gray-600">Inline Calendar Preview</p>
              <p className="text-xs text-gray-400 mt-1">Theme: {embedSettings.theme} | Layout: {embedSettings.layout}</p>
            </div>
          </div>;
      case 'floating':
        return <div className="relative w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="absolute bottom-4 right-4">
              <button className="px-4 py-2 rounded-lg shadow-lg text-sm font-medium" style={{
              backgroundColor: `#${embedSettings.buttonColor}`,
              color: `#${embedSettings.textColor}`
            }}>
                {embedSettings.displayCalendarIcon && '📅 '}
                {embedSettings.buttonText}
              </button>
            </div>
            <div className="absolute top-4 left-4">
              <p className="text-xs text-gray-500">Floating Button Preview</p>
              <p className="text-xs text-gray-400">Position: {embedSettings.position}</p>
            </div>
          </div>;
      case 'popup':
        return <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium mb-4">
                {embedSettings.buttonText}
              </button>
              <p className="text-sm text-gray-600">Pop-up Trigger Preview</p>
              <p className="text-xs text-gray-400 mt-1">Size: {embedSettings.windowWidth}% × {embedSettings.windowHeight}%</p>
            </div>
          </div>;
      case 'email':
        return <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <a href="#" className="inline-block px-6 py-3 rounded-lg text-sm font-medium mb-4" style={{
              backgroundColor: `#${embedSettings.buttonColor}`,
              color: `#${embedSettings.textColor}`,
              textDecoration: 'none'
            }}>
                {embedSettings.buttonText}
              </a>
              <p className="text-sm text-gray-600">Email Button Preview</p>
              <p className="text-xs text-gray-400 mt-1">Ready for email campaigns</p>
            </div>
          </div>;
      default:
        return null;
    }
  };
  const renderEmbedOptions = () => {
    const commonOptions = <>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <CustomSelect value={embedSettings.theme} onValueChange={value => handleSettingChange('theme', value)} options={themeOptions} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="hide-details" checked={embedSettings.hideEventTypeDetails} onCheckedChange={value => handleSettingChange('hideEventTypeDetails', value)} />
            <label htmlFor="hide-details" className="text-sm">Hide event type details</label>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <h4 className="font-medium text-sm">Brand Colors</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Color (Light Theme)</label>
              <div className="flex items-center space-x-3">
                <input type="color" value={`#${embedSettings.lightBrandColor}`} onChange={e => handleSettingChange('lightBrandColor', e.target.value.slice(1))} className="w-10 h-10 border border-gray-300 rounded cursor-pointer" />
                <input type="text" value={embedSettings.lightBrandColor} onChange={e => handleSettingChange('lightBrandColor', e.target.value.replace('#', ''))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="007ee5" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Brand Color (Dark Theme)</label>
              <div className="flex items-center space-x-3">
                <input type="color" value={`#${embedSettings.darkBrandColor}`} onChange={e => handleSettingChange('darkBrandColor', e.target.value.slice(1))} className="w-10 h-10 border border-gray-300 rounded cursor-pointer" />
                <input type="text" value={embedSettings.darkBrandColor} onChange={e => handleSettingChange('darkBrandColor', e.target.value.replace('#', ''))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="fafafa" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Layout</label>
          <CustomSelect value={embedSettings.layout} onValueChange={value => handleSettingChange('layout', value)} options={layoutOptions} />
        </div>
      </>;
    switch (embedType) {
      case 'inline':
        return <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              
              {commonOptions}
            </div>
          </div>;
      case 'floating':
        return <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button text</label>
                  <input type="text" value={embedSettings.buttonText} onChange={e => handleSettingChange('buttonText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="display-icon" checked={embedSettings.displayCalendarIcon} onCheckedChange={value => handleSettingChange('displayCalendarIcon', value)} />
                  <label htmlFor="display-icon" className="text-sm">Display calendar icon</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Position of button</label>
                  <CustomSelect value={embedSettings.position} onValueChange={value => handleSettingChange('position', value)} options={positionOptions} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Button color</label>
                    <div className="flex items-center space-x-2">
                      <input type="color" value={`#${embedSettings.buttonColor}`} onChange={e => handleSettingChange('buttonColor', e.target.value.slice(1))} className="w-8 h-8 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={embedSettings.buttonColor} onChange={e => handleSettingChange('buttonColor', e.target.value.replace('#', ''))} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Text color</label>
                    <div className="flex items-center space-x-2">
                      <input type="color" value={`#${embedSettings.textColor}`} onChange={e => handleSettingChange('textColor', e.target.value.slice(1))} className="w-8 h-8 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={embedSettings.textColor} onChange={e => handleSettingChange('textColor', e.target.value.replace('#', ''))} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              {commonOptions}
            </div>
          </div>;
      case 'popup':
        return <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Window sizing</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium w-4">W</span>
                      <input type="text" value={embedSettings.windowWidth} onChange={e => handleSettingChange('windowWidth', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium w-4">H</span>
                      <input type="text" value={embedSettings.windowHeight} onChange={e => handleSettingChange('windowHeight', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              {commonOptions}
            </div>
          </div>;
      case 'email':
        return <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button text</label>
                  <input type="text" value={embedSettings.buttonText} onChange={e => handleSettingChange('buttonText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Button color</label>
                    <div className="flex items-center space-x-2">
                      <input type="color" value={`#${embedSettings.buttonColor}`} onChange={e => handleSettingChange('buttonColor', e.target.value.slice(1))} className="w-8 h-8 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={embedSettings.buttonColor} onChange={e => handleSettingChange('buttonColor', e.target.value.replace('#', ''))} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Text color</label>
                    <div className="flex items-center space-x-2">
                      <input type="color" value={`#${embedSettings.textColor}`} onChange={e => handleSettingChange('textColor', e.target.value.slice(1))} className="w-8 h-8 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={embedSettings.textColor} onChange={e => handleSettingChange('textColor', e.target.value.replace('#', ''))} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="p-0 max-w-none mx-auto">
      <div className="space-y-8">
        {/* Embed Type Selection - Single Row */}
        <div className="flex gap-2 w-full">
          {[{
          key: 'inline',
          label: 'Inline'
        }, {
          key: 'floating',
          label: 'Floating Button'
        }, {
          key: 'popup',
          label: 'Pop up'
        }, {
          key: 'email',
          label: 'Email'
        }].map(type => <button key={type.key} onClick={() => setEmbedType(type.key)} className={`flex-1 px-6 py-3 border-2 rounded-lg text-center transition-all ${embedType === type.key ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="font-medium text-sm">{type.label}</span>
            </button>)}
        </div>

        {/* Main Content Area */}
        <div className="flex gap-8">
          {/* Left Side - Embed Options */}
          <div className="w-3/5">
            
            <div className="overflow-x-auto">
              {renderEmbedOptions()}
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-2/5">
            <div className="space-y-4">
              
              <div className="border rounded-lg p-4 bg-white">
                {renderPreview()}
              </div>
              
              {/* Get Code Button */}
              <div className="text-center">
                <h4 className="font-medium text-sm mb-1">Ready to embed?</h4>
                <p className="text-xs text-gray-600 mb-3">Get the code to add to your website</p>
                <button onClick={() => setShowCodeModal(true)} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  <Copy className="h-4 w-4 mr-2 inline" />
                  Get Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">HTML Code</h4>
                  <button onClick={() => copyToClipboard(generateEmbedCode('html'))} className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                  <code>{generateEmbedCode('html')}</code>
                </pre>
              </TabsContent>
              
              <TabsContent value="react" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">React Code</h4>
                  <button onClick={() => copyToClipboard(generateEmbedCode('react'))} className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                  <code>{generateEmbedCode('react')}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};