
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface EmbedModalProps {
  open: boolean;
  onClose: () => void;
  formId: string;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ open, onClose, formId }) => {
  const [selectedOption, setSelectedOption] = useState('inline');
  const [buttonText, setButtonText] = useState('Book my Cal');
  const [displayCalendarIcon, setDisplayCalendarIcon] = useState(true);
  const [position, setPosition] = useState('bottom-right');
  const [buttonColor, setButtonColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#000000');
  const [theme, setTheme] = useState('auto');
  const [brandColor, setBrandColor] = useState('#007ee5');
  const [darkBrandColor, setDarkBrandColor] = useState('#fafafa');
  const [layout, setLayout] = useState('month');
  const [windowWidth, setWindowWidth] = useState('100%');
  const [windowHeight, setWindowHeight] = useState('100%');

  const getEmbedCode = () => {
    switch (selectedOption) {
      case 'inline':
        return `<!-- Cal inline embed code begins -->
<div style="width:${windowWidth};height:${windowHeight};overflow:scroll" id="my-cal-inline"></div>
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document;
  C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) {
  cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A;
  cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); };
  const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string")
  {cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal,
  ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window,
  "https://app.calid.in/embed-link/embed.js", "init");
  Cal("init", "test", {origin:"https://calid.in"});
  
  Cal.ns.test("inline", {
    elementOrSelector:"#my-cal-inline",
    config: {"layout":"${layout}"},
    calLink: "forms/${formId}",
  });
</script>
<!-- Cal inline embed code ends -->`;

      case 'floating':
        return `<!-- Cal floating-popup embed code begins -->
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document;
  C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) {
  cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A;
  cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); };
  const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string")
  {cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal,
  ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window,
  "https://app.calid.in/embed-link/embed.js", "init");
  Cal("init", "test", {origin:"https://calid.in"});

  Cal.ns.test("floatingButton", {"calLink":"forms/${formId}","config":{"layout":"${layout}"}});
  Cal.ns.test("ui", {"hideEventTypeDetails":false,"layout":"${layout}"}});
</script>
<!-- Cal floating-popup embed code ends -->`;

      case 'popup':
        return `<!-- Cal element-click embed code begins -->
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document;
  C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) {
  cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A;
  cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); };
  const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string")
  {cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal,
  ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; }; })(window,
  "https://app.calid.in/embed-link/embed.js", "init");
  Cal("init", "test", {origin:"https://calid.in"});

  // Important: Please add the following attributes to the element that should trigger the calendar to open upon clicking.
  // \`data-cal-link="forms/${formId}"\`
  // \`data-cal-namespace="test"\`
  
  Cal.ns.test("ui", {"styles":{"branding":{"brandColor":"${brandColor}"}},"hideEventTypeDetails":false,"layout":"${layout}"}});
</script>
<!-- Cal element-click embed code ends -->`;

      default:
        return '';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    // You could add a toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How do you want to add OneHash Cal to your site?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose one of the following ways to put OneHash Cal on your site.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 my-6">
          <button
            onClick={() => setSelectedOption('inline')}
            className={`p-6 border-2 rounded-lg text-left transition-colors ${
              selectedOption === 'inline' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-32 bg-gray-100 rounded mb-4 relative">
              <div className="absolute inset-4 border-2 border-blue-400 rounded">
                <div className="grid grid-cols-7 gap-1 p-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className={`h-2 rounded ${i === 15 ? 'bg-blue-600' : i % 7 === 1 ? 'bg-gray-800' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
            <h3 className="font-semibold">Inline Embed</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Loads your event type directly inline with your other website content.
            </p>
          </button>

          <button
            onClick={() => setSelectedOption('floating')}
            className={`p-6 border-2 rounded-lg text-left transition-colors ${
              selectedOption === 'floating' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-32 bg-gray-100 rounded mb-4 relative">
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
                Book my Cal
              </div>
            </div>
            <h3 className="font-semibold">Floating pop-up button</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Puts a floating button on your site that triggers a modal with your event type.
            </p>
          </button>

          <button
            onClick={() => setSelectedOption('popup')}
            className={`p-6 border-2 rounded-lg text-left transition-colors ${
              selectedOption === 'popup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-32 bg-gray-100 rounded mb-4 relative flex items-center justify-center">
              <div className="text-center">
                <div className="h-2 w-20 bg-gray-400 rounded mb-2 mx-auto" />
                <div className="h-2 w-16 bg-gray-400 rounded mb-2 mx-auto" />
                <div className="h-6 w-6 bg-gray-800 rounded mx-auto" />
              </div>
            </div>
            <h3 className="font-semibold">Pop up via element click</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Open your calendar as a dialog when someone clicks an element.
            </p>
          </button>
        </div>

        <Tabs value="html" className="w-full">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="space-y-4">
            {selectedOption === 'floating' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button text</Label>
                  <Input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Book my Cal"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={displayCalendarIcon}
                    onCheckedChange={setDisplayCalendarIcon}
                  />
                  <Label>Display calendar icon</Label>
                </div>
                <div className="space-y-2">
                  <Label>Position of button</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom right</SelectItem>
                      <SelectItem value="bottom-left">Bottom left</SelectItem>
                      <SelectItem value="top-right">Top right</SelectItem>
                      <SelectItem value="top-left">Top left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Button color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedOption === 'inline' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Window sizing</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label className="text-xs">W</Label>
                      <Input
                        value={windowWidth}
                        onChange={(e) => setWindowWidth(e.target.value)}
                        placeholder="100%"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">H</Label>
                      <Input
                        value={windowHeight}
                        onChange={(e) => setWindowHeight(e.target.value)}
                        placeholder="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
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
              <div className="space-y-2">
                <Label>Brand Color (Light Theme)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Brand Color (Dark Theme)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={darkBrandColor}
                    onChange={(e) => setDarkBrandColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={darkBrandColor}
                    onChange={(e) => setDarkBrandColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Layout</Label>
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

            <div className="space-y-2">
              <Label>Place this code in your HTML where you want your OneHash Cal widget to appear.</Label>
              <div className="relative">
                <Textarea
                  value={getEmbedCode()}
                  readOnly
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
            </div>

            {selectedOption === 'inline' && (
              <div className="bg-black rounded-lg p-4 text-white">
                <h3 className="text-lg font-semibold mb-2">Test form 1</h3>
                <p className="text-gray-400 text-sm mb-4">testing the routing forms option</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Submit</Button>
                <div className="mt-4 text-center">
                  <span className="text-blue-400 font-semibold">OneHash</span>
                </div>
              </div>
            )}

            {selectedOption === 'floating' && (
              <div className="bg-black rounded-lg p-4 relative h-64">
                <div className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <span>📅</span>
                  <span>Book my Cal</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopyCode}>
            Copy Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
