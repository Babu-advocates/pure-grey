import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Flame, ArrowLeft } from "lucide-react";
import heroFireworks from "@/assets/hero-fireworks.jpg";

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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background with fireworks image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroFireworks})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background/50 to-accent/20" />
      
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 text-foreground hover:text-primary hover:bg-primary/10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Flame className="w-12 h-12 text-primary animate-glow-pulse" />
            <Sparkles className="w-10 h-10 text-accent animate-glow-pulse" />
            <Flame className="w-12 h-12 text-primary animate-glow-pulse" />
          </div>
          <h1 className="text-4xl font-black speed-text bg-gradient-gold bg-clip-text text-transparent text-center">
            KR FIREWORKS
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            Light up your celebrations with spectacular fireworks!
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-primary/20 shadow-2xl shadow-primary/20">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-black bg-gradient-gold bg-clip-text text-transparent">
              Join the Celebration
            </CardTitle>
            <CardDescription className="text-base">
              🎆 Sign in to explore our explosive collection 🎆
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-primary/10 border border-primary/20">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground font-semibold"
                >
                  🎇 Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground font-semibold"
                >
                  ✨ Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-foreground font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your-email@celebration.com"
                      required
                      className="border-primary/30 focus:border-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-foreground font-semibold flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="border-primary/30 focus:border-primary h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold bg-gradient-gold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Lighting the way..." : "🎆 Light Up & Sign In 🎆"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Your celebration name"
                      required
                      className="border-primary/30 focus:border-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground font-semibold flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your-email@celebration.com"
                      required
                      className="border-primary/30 focus:border-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground font-semibold flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                      className="border-primary/30 focus:border-primary h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold bg-gradient-gold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sparking your account..." : "🎇 Spark Your Account 🎇"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
