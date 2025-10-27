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
      {/* Small internal styles for a simple, dependency-free entrance animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(.85); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .fade-up { animation: fadeUp 560ms cubic-bezier(.2,.9,.2,1) both; }
        .pop-in { animation: pop 520ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      <div className="fade-up max-w-lg w-full">
        <Card className="relative w-full bg-white/75 backdrop-blur-sm border border-white/40 rounded-2xl shadow-[0_10px_40px_rgba(7,11,20,0.06)] overflow-hidden">
          <div className="text-center px-8 py-14 space-y-6">
            {/* Icon with small pop animation */}
            <div className="flex justify-center">
              <div className="pop-in">
                <Sparkles className="h-10 w-10 text-blue-600/90" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Nothing's here yet ✨
            </h1>

            {/* Availability message (minimal, prominent slug) */}
            <div className="space-y-1">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                <span className="inline-block font-mono text-blue-600 font-medium bg-white/80 px-4 py-1 rounded-lg border border-blue-100 shadow-sm">
                  cal.id/{slug}
                </span>{" "}
                is available
              </p>
              <p className="text-sm md:text-base text-gray-600">
                Make it yours in seconds.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={handleClaimCalId}
                size="lg"
                className="w-full sm:w-auto px-6 shadow-md hover:shadow-lg transition-shadow bg-blue-600 text-white"
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
