import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Zap, Users, Shield, Clock } from "lucide-react";
import { AnimatedCalendar } from "@/components/AnimatedCalendar";

const ClaimUsername = () => {
  const { username = "daw" } = useParams<{ username: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Cal<span className="text-primary">ID</span>
          </span>
          <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            Already have an account? <span className="font-semibold">Sign in</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
              <Clock className="w-4 h-4" />
              This username is still available!
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Claim <span className="text-primary">cal.id/{username}</span>
                <br />before someone else does
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Your professional scheduling link. Simple, memorable, and 100% yours.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-4">
              <Button size="lg" className="px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
                <Zap className="w-5 h-5 mr-2" />
                Claim Your Username — It's Free
              </Button>
              <p className="text-sm text-gray-500">
                No credit card required • Setup in 60 seconds
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Instant Setup</p>
                    <p className="text-xs text-gray-500">Go live in under a minute</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">50K+ Users</p>
                    <p className="text-xs text-gray-500">Trusted by professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Yours Forever</p>
                    <p className="text-xs text-gray-500">Once claimed, it's locked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Animated Calendar */}
          <div className="hidden lg:block">
            <AnimatedCalendar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        © 2026 Cal ID. All rights reserved.
      </footer>
    </div>
  );
};

export default ClaimUsername;
