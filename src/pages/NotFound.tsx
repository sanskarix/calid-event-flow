import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const slug = location.pathname.replace(/^\//, "") || "username";

  useEffect(() => {
    const msg = `404: User attempted to access: ${location.pathname}`;
    if (process.env.NODE_ENV !== "production") {
      console.warn(msg);
    }
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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 600ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      <div className="fade-up max-w-2xl w-full"> {/* 20% larger container */}
        <Card className="relative w-full bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_10px_45px_rgba(7,11,20,0.06)] overflow-hidden">
          <div className="text-center px-10 py-16 space-y-8">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
              Nothing’s here yet
            </h1>

            {/* Subtext */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                <span className="inline-block font-mono text-blue-600 font-medium bg-white/80 px-4 py-1 rounded-lg border border-blue-100 shadow-sm">
                  cal.id/{slug}
                </span>{" "}
                hasn’t been claimed yet.
              </p>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Want to make it yours?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                onClick={handleClaimCalId}
                size="lg"
                className="w-full sm:w-auto px-7 py-6 shadow-md hover:shadow-lg transition-all bg-blue-600 text-white rounded-xl"
              >
                Claim this Cal ID
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/")}
                size="lg"
                className="w-full sm:w-auto px-7 py-6 bg-gray-100/80 hover:bg-gray-200/80 text-gray-800 rounded-xl flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to homepage
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
