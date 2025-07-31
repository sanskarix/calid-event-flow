import React from 'react';
import { ArrowLeft, ExternalLink, Mail, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface App {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
}

interface AppDetailsProps {
  app: App;
  isInstalled: boolean;
  installedCount: number;
  onBack: () => void;
  onInstall: () => void;
}

export const AppDetails: React.FC<AppDetailsProps> = ({
  app,
  isInstalled,
  installedCount,
  onBack,
  onInstall,
}) => {
  const productImages = [
    'https://cdn.builder.io/api/v1/image/assets%2Fd4a10180bf86487694b9b457d0ef97e4%2F0cd9373df53f44b09bda8c22ff613c51?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2Fd4a10180bf86487694b9b457d0ef97e4%2Fec6b7208490a4017b11ee4a9e4197409?format=webp&width=800'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">{app.name}</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 space-y-6">
            <div className="rounded-lg overflow-hidden border">
              <img
                src={productImages[0]}
                alt={`${app.name} main`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {productImages.slice(1).map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt={`${app.name} ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <div className="rounded-lg p-6 border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center border border-border flex-shrink-0 text-3xl">
                  {app.logo}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{app.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-gray-700 text-xs font-medium rounded border">
                      {app.category}
                    </span>
                    <p className="text-slate-500 text-xs">Published by Cal.id</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {isInstalled ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span>{installedCount > 1 ? `${installedCount} active installs` : '1 active install'}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Not Installed</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                {app.description}
              </p>

              <Button
                onClick={onInstall}
                className="w-full bg-[#007ee5] hover:bg-[#005bb5] text-white transition-colors duration-300 ease-in-out"
              >
                {isInstalled ? 'Reinstall' : 'Install'}
              </Button>
            </div>

            <div className="rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">How to Get Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Log in to your {app.name} account by installing the app.</li>
                <li>Set up the Client SDK on your website.</li>
                <li>Add app.cal.com to your Outbound Domains.</li>
                <li>Once a booking event occurs, your tracking data will be captured.</li>
              </ol>
            </div>

            <div className="rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <p className="text-muted-foreground">Free</p>
            </div>

            <div className="rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://${app.name.toLowerCase()}.co`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.name.toLowerCase()}.co
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:help@${app.name.toLowerCase()}.com`}
                    className="text-blue-600 hover:underline"
                  >
                    help@{app.name.toLowerCase()}.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
