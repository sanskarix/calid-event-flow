import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";

const ClaimUsername = () => {
  const { username = "daw" } = useParams<{ username: string }>();
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-xl bg-gray-50 border-0 shadow-sm">
        <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            No man's land - Conquer it today!
          </h1>
          
          <p className="text-gray-600 text-base">
            Claim username <span className="font-semibold">'{username}'</span> on{" "}
            <span className="font-semibold">Cal ID</span> now before someone else does! 📅🔥
          </p>
          
          <div className="pt-2">
            <Button className="px-6">
              Register now
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm pt-2">
            Or Lost your way?{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Log in to your personal space
            </Link>
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-10">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          Cal<span className="text-primary">ID</span>
        </span>
      </div>
    </div>
  );
};

export default ClaimUsername;
