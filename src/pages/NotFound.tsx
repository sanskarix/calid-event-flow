import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const slug = location.pathname.replace(/^\//, "") || "username";

  useEffect(() => {
    const msg = `404: User attempted to access: ${location.pathname}`;
    if (process.env.NODE_ENV !== "production") console.warn(msg);
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
          from { opacity: 0; transform: translateY(25px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 600ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      <div className="fade-up max-w-2xl w-full scale-110">
        <Card className="relative w-full bg-white/85 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_10px_45px_rgba(7,11,20,0.06)] overflow-hidden">
          <div className="flex flex-col items-center text-center px-10 py-16 space-y-8">
            {/* Illustration */}
            <img
              src="https://illustrations.popsy.co/gray/mountain.svg"
              alt="Mountain Illustration"
              className="w-56 h-56 object-contain opacity-95"
            />

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
              Nothing’s here yet
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-md">
              <span
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                onClick={handleClaimCalId}
              >
                cal.id/{slug}
              </span>{" "}
              is still available 
            </p>
            <br>  </br>
            <p>
              claim it before someone else does!</p>

            {/* Buttons (stacked vertically) */}
            <div className="flex flex-col gap-4 w-full sm:w-2/3 pt-4">
              <Button
                onClick={handleClaimCalId}
                size="lg"
                className="w-full px-6 py-6 text-lg font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Claim this page
              </Button>

              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="w-full px-6 py-6 text-lg font-medium rounded-xl bg-gray-100/90 text-gray-800 hover:bg-gray-200/90 transition-all shadow-sm hover:shadow-md"
              >
                Go to cal.id
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
