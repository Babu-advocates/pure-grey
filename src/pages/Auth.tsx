import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import krLogo from "@/assets/kr-fireworks-logo.png";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Main Content Card */}
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white border-2 border-blue-900 rounded-2xl shadow-xl p-8">

          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-6">
              <img
                src={krLogo}
                alt="KR Fireworks"
                className="relative h-16 object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome</h2>
              <p className="text-gray-500">
                Sign in to access your fireworks collection
              </p>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm text-gray-500 transition-all font-medium">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm text-gray-500 transition-all font-medium">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 border-0 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      minLength={6}
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 border-0 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
