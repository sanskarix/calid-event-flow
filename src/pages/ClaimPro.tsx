import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BlackFridayModal from '@/components/BlackFridayModal';

const ClaimPro = () => {
  const { toast } = useToast();
  const [firstYearClaimed, setFirstYearClaimed] = useState(false);
  const [showBlackFridayModal, setShowBlackFridayModal] = useState(false);

  useEffect(() => {
    // Show modal on page load
    setShowBlackFridayModal(true);
  }, []);

  const handleClaimFirstYear = () => {
    setFirstYearClaimed(true);
    toast({
      title: "First Year Claimed!",
      description: "You've successfully claimed your first year of Cal ID Pro.",
    });
  };

  const handleClaimSecondYear = () => {
    toast({
      title: "Second Year Claimed!",
      description: "You've successfully claimed your second year of Cal ID Pro.",
    });
  };

  const handleBlackFridayClaim = () => {
    toast({
      title: "Black Friday Offer Claimed!",
      description: "You've successfully claimed 2 years of Cal ID Pro for free!",
    });
  };

  return (
    <>
      <BlackFridayModal 
        open={showBlackFridayModal} 
        onOpenChange={setShowBlackFridayModal}
        onClaim={handleBlackFridayClaim}
      />
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Get 2 Years of Pro
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Get Cal ID's Pro version for the next 2 years for free
          </p>
        </div>

        {/* Claim Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* First Year Card */}
          <Card className="bg-white dark:bg-gray-950 shadow-md">
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">First Year Pro</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Unlock all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                size="default" 
                className="px-6"
                onClick={handleClaimFirstYear}
              >
                Claim Pro
              </Button>
            </CardContent>
          </Card>

          {/* Second Year Card */}
          <Card className="bg-white dark:bg-gray-950 shadow-md">
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-600 dark:text-gray-500">Second Year Pro</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-600">
                Unlock all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                size="default" 
                className="px-6"
                onClick={handleClaimSecondYear}
                disabled={!firstYearClaimed}
              >
                Complete First Year
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="bg-white dark:bg-gray-950 shadow-md max-w-4xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-blue-500" />
              What's included in Pro?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited Teams</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Routing Forms</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">API Access</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Custom Branding</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Workflows</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Advanced Analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default ClaimPro;
