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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Claim Pro for 2 Years
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Claim Cal ID's pro version for the next 2 years for free
          </p>
        </div>

        {/* Claim Cards */}
        <div className="relative max-w-2xl mx-auto h-[440px]">
          {/* Second Year Card - Behind */}
          <Card className={`absolute left-1/2 -translate-x-1/2 w-[90%] overflow-hidden border-2 transition-all duration-700 ease-in-out ${
            firstYearClaimed 
              ? 'top-0 scale-100 z-20 border-primary/50 shadow-2xl opacity-100 rotate-0' 
              : 'top-6 scale-95 z-10 opacity-70 rotate-[-1deg]'
          }`}>
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity ${
              firstYearClaimed ? 'opacity-100' : 'opacity-0'
            }`} />
            <CardHeader className="text-center pb-6 pt-8 relative">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <Gift className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Second Year Pro</CardTitle>
              <CardDescription className="text-base">
                Continue your premium access
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8 relative">
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleClaimSecondYear}
                disabled={!firstYearClaimed}
              >
                Claim Second Year
              </Button>
            </CardContent>
          </Card>

          {/* First Year Card - Front */}
          <Card className={`absolute left-1/2 -translate-x-1/2 w-full overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-700 ease-in-out ${
            firstYearClaimed 
              ? 'top-[120%] scale-95 opacity-0 pointer-events-none z-10 rotate-[2deg]' 
              : 'top-0 scale-100 z-20 opacity-100 rotate-0 shadow-2xl'
          } group`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="text-center pb-6 pt-8 relative">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Gift className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">First Year Pro</CardTitle>
              <CardDescription className="text-base">
                Unlock all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8 relative">
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleClaimFirstYear}
              >
                Claim First Year
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-br from-card to-muted/30 border-2">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What's included in Pro?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Unlimited event types and bookings</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Advanced calendar integrations</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Custom workflows and automations</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Priority support and analytics</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors sm:col-span-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Team collaboration features</span>
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
