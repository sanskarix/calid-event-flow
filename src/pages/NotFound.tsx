import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const slug = location.pathname.replace(/^\//, "") || "username";

  useEffect(() => {
    console.error("404 Error: User attempted to access:", location.pathname);
  }, [location.pathname]);

  const handleClaimCalId = () => {
    navigate(`/?signup=true&username=${slug}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background:
          "linear-gradient(hsla(213,100%,97%,1),hsla(229,100%,97%,1),hsla(270,100%,98%,1))",
      }}
    >
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-600">
        <Card
          className="relative max-w-lg w-full bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="text-center px-8 py-14 space-y-8">
            {/* Emoji/Icon header */}
            <div className="flex justify-center animate-in fade-in scale-in-50 duration-600 delay-100">
              <Sparkles className="h-10 w-10 text-primary/80" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Nothing's here yet ✨
            </h1>

            {/* Availability message */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                <span className="inline-block font-mono text-primary font-medium bg-white/70 px-4 py-1.5 rounded-xl border border-primary/20 shadow-sm">
                  cal.id/{slug}
                </span>{" "}
                is available
              </p>
              <p className="text-base text-gray-600">
                Grab your Cal ID before someone else does.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                onClick={handleClaimCalId}
                size="lg"
                className="w-full sm:w-auto px-6 shadow-lg hover:shadow-xl transition-all bg-primary text-white"
              >
                Claim my Cal ID
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                size="lg"
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900"
              >
                <Home className="h-4 w-4 mr-2" />
                Go home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
