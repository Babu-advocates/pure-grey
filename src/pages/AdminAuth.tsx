import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft, Lock } from "lucide-react";
import krLogo from "@/assets/kr-fireworks-logo.png";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-6">
            <img
              src={krLogo}
              alt="KR Fireworks"
              className="relative h-16 object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sky-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">Admin Portal</span>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-900 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Administrator Login
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your secure credentials to access the control panel
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-gray-700 font-medium">Admin Email</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@krfireworks.com"
                  required
                  className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Enter secure password"
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
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          All login attempts are logged and monitored
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
