import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Password = () => {
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  useEffect(() => {
    setHeaderMeta({
      title: 'Password',
      description: "Manage authentication for your account.",
    });
  }, [setHeaderMeta]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className="flex border rounded-lg p-6 bg-card">
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium mb-1">Your account is managed by Google</p>
            <p className="text-sm text-muted-foreground">
              To change your email, password, enable two-factor authentication and more, please visit your Google account settings.
            </p>
          </div>
          <div className='flex items-center ml-auto'>
            <Button>
              Create account password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};