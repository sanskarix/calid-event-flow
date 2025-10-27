import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract slug from pathname (e.g., /sanskar -> sanskar)
  const slug = location.pathname.replace(/^\//, '') || 'username';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleClaimCalId = () => {
    // Navigate to signup with pre-filled username
    // In a real app, this would pass the slug as a query param
    navigate(`/?signup=true&username=${slug}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md space-y-8 animate-fade-in">
        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Nothing's here yet!
          </h1>
          
          {/* Slug availability message */}
          <p className="text-lg md:text-xl text-muted-foreground">
            <span className="font-mono text-primary">/{slug}</span> is available – claim your Cal ID page in seconds.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button 
            onClick={handleClaimCalId}
            size="lg"
            className="w-full sm:w-auto"
          >
            Claim my Cal ID
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Go home
          </Button>
        </div>

        {/* Optional 404 indicator */}
        <p className="text-sm text-muted-foreground pt-8">
          Error 404 • Page not found
        </p>
      </div>
    </div>
  );
};

export default NotFound;
