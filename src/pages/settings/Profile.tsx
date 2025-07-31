import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Bold, Italic, Link, MoreHorizontal, Plus, Trash2, Info } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Profile = () => {
  const [fullName, setFullName] = useState('Sanskar Yadav');
  const [username, setUsername] = useState('sanskaryadav');
  const [emails, setEmails] = useState([
    { email: 'sanskarix@gmail.com', isPrimary: true }
  ]);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [about, setAbout] = useState('Head of Growth @OneHash | Building the craziest tools on the Internet 🚀');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();

  useEffect(() => {
    setHeaderMeta({
      title: 'Profile',
      description: 'Manage settings for your OneHash Cal profile.',
    });
  }, [setHeaderMeta]);

  const countries = [
    { code: '+91', flag: '🇮🇳' },
    { code: '+1-us', flag: '🇺🇸', display: '+1' },
    { code: '+44', flag: '🇬🇧' },
    { code: '+971', flag: '🇦🇪' },
    { code: '+61', flag: '🇦🇺' },
    { code: '+1-ca', flag: '🇨🇦', display: '+1' },
  ];

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    if (value !== numbersOnly) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
    setPhone(numbersOnly);
  };

  const handleSendCode = () => {
    if (phone && !phoneError) {
      setIsCodeSent(true);
    }
  };

  const handleAddEmail = () => {
    if (newEmail) {
      setEmails([...emails, { email: newEmail, isPrimary: false }]);
      setNewEmail('');
      setIsAddEmailOpen(false);
    }
  };

  const handleMakePrimary = (index: number) => {
    if (emails.length > 1) {
      const updatedEmails = emails.map((email, i) => ({
        ...email,
        isPrimary: i === index
      }));
      const primaryEmail = updatedEmails.splice(index, 1)[0];
      setEmails([primaryEmail, ...updatedEmails]);
    }
  };

  const handleDeleteEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('about') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const newText = textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end);
      setAbout(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    }
  };

  const handleAddLink = () => {
    if (linkUrl) {
      insertMarkdown('[', `](${linkUrl})`);
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="px-8 py-6 w-full">
        <div className="space-y-8 mb-12">
          {/* Profile Information Section */}
          <div className="border rounded-lg p-6 bg-card space-y-8 hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
            {/* Profile Picture */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <img src="/lovable-uploads/b849b475-852b-4552-92f1-185302b164ba.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="space-x-2">
                  <Button variant="outline" className="hover:scale-105 transition-transform duration-200">Upload Avatar</Button>
                  <Button variant="outline" className="hover:scale-105 transition-transform duration-200">Remove</Button>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                  cal.id/
                </div>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-l-none" />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="space-y-2">
                {emails.map((emailItem, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input value={emailItem.email} readOnly />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        {emailItem.isPrimary && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Primary</span>
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm"
                              onClick={() => handleMakePrimary(index)}
                              disabled={emails.length === 1 || emailItem.isPrimary}
                            >
                              Make Primary
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteEmail(index)}
                              disabled={emails.length === 1}
                            >
                              Delete
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                <Dialog open={isAddEmailOpen} onOpenChange={setIsAddEmailOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Add an email address to replace your primary or to use as an alternative email on your event types.
                        You may need to log out and back in to see any change take effect.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Email Address</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                      <Button onClick={handleAddEmail} className="w-full">
                        Add
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-24 rounded-r-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.display || country.code}>
                          {country.flag} {country.display || country.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`rounded-l-none ${phoneError ? 'border-red-500' : ''}`}
                    style={phoneError ? { borderColor: '#f1352c' } : {}}
                    placeholder="Phone number"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSendCode} disabled={!phone || phoneError} className="hover:scale-105 transition-transform duration-200">
                  Send code
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={!isCodeSent}
                />
                <Button variant="outline" disabled={!verificationCode} className="hover:scale-105 transition-transform duration-200">
                  Verify
                </Button>
              </div>
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <div className="border rounded-md">
                <div className="flex items-center space-x-2 p-2 border-b">
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('**', '**')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('*', '*')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Link className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <Label htmlFor="linkUrl">Enter URL:</Label>
                        <Input
                          id="linkUrl"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddLink}>Add Link</Button>
                          <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="border-none resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-destructive/30 rounded-lg p-6 bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200 animate-fade-in">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2 text-destructive">Danger zone</h2>
            <p className="text-sm text-muted-foreground">Be careful. Account deletion cannot be undone.</p>
          </div>
          <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground hover:scale-105 transition-transform duration-200">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
};
