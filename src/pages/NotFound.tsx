import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.replace(/^\//, '') || 'username';

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleClaimCalId = () => {
    navigate(`/?signup=true&username=${slug}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background:
          "linear-gradient(hsla(213,100%,97%,1), hsla(229,100%,97%,1), hsla(270,100%,98%,1))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          className="relative max-w-xl w-full overflow-hidden bg-white/90 dark:bg-gray-950/90 border border-gray-100 rounded-3xl backdrop-blur-xl"
          style={{
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="relative text-center space-y-10 p-10 md:p-16">
            {/* Illustration or emoji */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-5 rounded-full">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </motion.div>

            {/* Title and subtext */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Nothing’s here yet!
              </h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                Looks like <span className="font-semibold text-gray-800">cal.id/{slug}</span> isn’t
                taken — but it could be yours in seconds.
              </p>
            </div>

            {/* Slug availability */}
            <div className="space-y-3">
              <p className="text-base md:text-lg text-gray-700 font-medium">
                Secure your Cal ID before someone else does 👀
              </p>
              <p className="inline-block font-mono text-primary font-semibold bg-primary/5 px-5 py-2 rounded-lg border border-primary/20 shadow-sm">
                cal.id/{slug}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleClaimCalId}
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all relative"
                  style={{
                    boxShadow:
                      "0 0 0 0 rgba(0,118,229,0.4)",
                    transition: "box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 20px 2px rgba(0,118,229,0.25)")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 0 rgba(0,118,229,0.4)")
                  }
                >
                  Claim my Cal ID
                </Button>
              </motion.div>

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

            {/* Subtle footer note */}
            <p className="text-xs text-gray-400 pt-6">
              Cal ID — free scheduling made simple.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
