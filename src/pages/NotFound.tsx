import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract slug from pathname (e.g., /sanskar -> sanskar)
  const slug = location.pathname.replace(/^\//, '') || 'username';
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  const handleClaimCalId = () => {
    // Navigate to signup with pre-filled username
    // In a real app, this would pass the slug as a query param
    navigate(`/?signup=true&username=${slug}`);
  };
  return <div 
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: 'linear-gradient(hsla(213,100%,97%,1),hsla(229,100%,97%,1),hsla(270,100%,98%,1))'
      }}
    >
      <Card 
        className="relative max-w-xl w-full overflow-hidden bg-white dark:bg-gray-950 border-0"
        style={{
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="relative text-center space-y-10 p-10 md:p-16">
          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Nothing's here yet!
            </h1>
            
            {/* Slug availability message */}
            <div className="space-y-3">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                <span className="inline-block font-mono text-primary font-semibold bg-white/60 px-4 py-1.5 rounded-lg border border-primary/20 shadow-sm">
                  cal.id/{slug}
                </span>
                {" "}is still available
              </p>
              <p className="text-base md:text-lg text-gray-700 font-medium">
                Make it yours now!
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button onClick={handleClaimCalId} size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              Claim my Cal ID
            </Button>
            
            <Button variant="ghost" onClick={() => navigate('/')} size="lg" className="w-full sm:w-auto text-gray-700 hover:text-gray-900">
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Button>
          </div>

          {/* Optional 404 indicator */}
          
        </div>
      </Card>
    </div>;
};
export default NotFound;