
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { ImportIcon, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Import = () => {
  const [notifyBookers, setNotifyBookers] = useState(true);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  useEffect(() => {
    setHeaderMeta({
      title: 'Import',
      description: "Import configuration from third-party services.",
    });
  }, [setHeaderMeta]);

  const handleNotifyBookersChange = (checked: boolean | "indeterminate") => {
    setNotifyBookers(checked === true);
  };

  const handleImport = () => {
    window.open('https://calendly.com/app/login', '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
          <div className="flex justify-between border border-border rounded-lg p-6 bg-card">
            <div className="flex flex-col items-start">
              <h2 className='text-lg font-medium mb-1'>Import form Calendly</h2>
              <div className='flex items-center space-x-2'>
                <Checkbox 
                  checked={notifyBookers}
                  onCheckedChange={handleNotifyBookersChange}
                />
                <p className='text-sm'>Notify past bookers about your migration</p>
              </div>
            </div>
            <div className='flex items-center'>
              <Button onClick={handleImport}>
                <ImportIcon />
                Import
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
