import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft, Lock } from "lucide-react";
import heroFireworks from "@/assets/hero-fireworks.jpg";

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // First, sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user is an admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        _user_id: authData.user.id
      });

      if (adminError || !isAdminData) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get admin details
      const { data: adminDetails } = await supabase
        .from('admin')
        .select('username, email')
        .eq('user_id', authData.user.id)
        .single();

      toast({
        title: "Admin Access Granted",
        description: `Welcome back, ${adminDetails?.username || 'Admin'}.`,
      });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          filter: 'brightness(0.2)'
        }}
      />
      
      {/* Overlay gradient - darker for admin */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-destructive/30 via-background/60 to-primary/20" />
      
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
            <Shield className="w-14 h-14 text-destructive animate-glow-pulse" />
            <Lock className="w-12 h-12 text-primary animate-glow-pulse" />
          </div>
          <h1 className="text-4xl font-black speed-text bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent text-center">
            ADMIN ACCESS
          </h1>
          <p className="text-muted-foreground text-center text-sm font-semibold">
            🔒 Authorized Personnel Only 🔒
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-destructive/30 shadow-2xl shadow-destructive/20">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
              Administrator Login
            </CardTitle>
            <CardDescription className="text-base">
              Enter your admin credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-foreground font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-destructive" />
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@krfireworks.com"
                  required
                  className="border-destructive/30 focus:border-destructive h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-foreground font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-destructive" />
                  Admin Password
                </Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Enter secure password"
                  required
                  className="border-destructive/30 focus:border-destructive h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-destructive to-destructive/80 hover:opacity-90 transition-opacity shadow-lg shadow-destructive/30" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "🔐 Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          All admin login attempts are logged and monitored
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
