import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Flag } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <Card className="relative max-w-lg w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border-primary/10 shadow-xl">
        {/* Decorative flag illustration */}
        <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-bl-[100%] flex items-start justify-end p-3">
          <Flag className="w-8 h-8 text-primary rotate-12 animate-pulse" />
        </div>
        
        <div className="relative text-center space-y-8 p-8 md:p-12">
          {/* Main content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Nothing's here yet!
            </h1>
            
            {/* Slug availability message */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                <span className="inline-block font-mono text-primary font-semibold bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
                  /{slug}
                </span>
                {" "}is available
              </p>
              <p className="text-base text-muted-foreground">
                Claim your Cal ID page in seconds
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button 
              onClick={handleClaimCalId}
              size="lg"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
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
          <p className="text-xs text-muted-foreground/70 pt-6">
            Error 404 • Page not found
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
