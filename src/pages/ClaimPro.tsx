import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClaimPro = () => {
  const { toast } = useToast();

  const handleClaimFirstYear = () => {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Claim Pro for 2 Years</h1>
        <p className="text-muted-foreground mt-2">
          Claim Cal ID's pro version for the next 2 years for free
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">First Year Pro Access</CardTitle>
            <CardDescription className="text-base">
              Unlock all premium features for your first year
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              size="lg" 
              className="w-full max-w-md h-14 text-lg font-semibold"
              onClick={handleClaimFirstYear}
            >
              Claim First Year
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Second Year Pro Access</CardTitle>
            <CardDescription className="text-base">
              Continue with all premium features for your second year
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              size="lg" 
              className="w-full max-w-md h-14 text-lg font-semibold"
              onClick={handleClaimSecondYear}
            >
              Claim Second Year
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-4xl mx-auto bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">What's included in Pro?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Unlimited event types and bookings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Advanced calendar integrations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Custom workflows and automations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Priority support and analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Team collaboration features</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimPro;
