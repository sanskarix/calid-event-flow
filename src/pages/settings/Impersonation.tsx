import React, { useEffect, useState } from 'react';
import { Switch } from '../../components/ui/switch';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Impersonation = () => {
  const [userImpersonation, setUserImpersonation] = useState(true);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  useEffect(() => {
    setHeaderMeta({
      title: 'Impersonation',
      description: "Settings to manage user impersonation.",
    });
  }, [setHeaderMeta]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-1">User Impersonation</h2>
              <p className="text-sm text-muted-foreground">
                Allows our support team to temporarily sign in as you to help us quickly resolve any issues you report to us.
              </p>
            </div>
            <Switch 
              checked={userImpersonation}
              onCheckedChange={setUserImpersonation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};