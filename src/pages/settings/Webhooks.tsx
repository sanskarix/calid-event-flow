
import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Plus, Link } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from  '../Settings';

export const Webhooks = () => {
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  
  useEffect(() => {
    setHeaderMeta({
      title: 'Webhooks',
      description: "Receive meeting data in real-time when something happens in Cal ID",
    });
  }, [setHeaderMeta]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="px-8 py-6 w-full">
        <div className="border rounded-lg p-6 bg-card">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Link className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Create your first Webhook</h2>
          
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            With Webhooks you can receive meeting data in real-time when something happens in Cal ID
          </p>

          <Button>
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
