import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Users, Package, ShoppingCart, TrendingUp, Menu, BarChart3, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, [navigate]);

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin');
      return;
    }

    // Verify user is admin
    const { data: isAdminData } = await supabase.rpc('is_admin', {
      _user_id: session.user.id
    });

    if (!isAdminData) {
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

    // Get admin details
    const { data: adminDetails } = await supabase
      .from('admin')
      .select('username, email')
      .eq('user_id', session.user.id)
      .maybeSingle();

    setAdminUser({
      id: session.user.id,
      username: adminDetails?.username || 'Admin',
      email: adminDetails?.email || session.user.email
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Admin Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-destructive/30 shadow-lg shadow-destructive/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <Shield className="w-8 h-8 text-destructive animate-glow-pulse group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-destructive/20 blur-xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black speed-text bg-gradient-to-r from-destructive via-accent to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  ADMIN PANEL
                </h1>
                <p className="text-xs text-muted-foreground">KR Fireworks Control Center</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/admin/dashboard" className="text-primary transition-all duration-300 font-medium relative">
                Dashboard
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              </Link>
              <Link to="/admin/products" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/categories" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/orders" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/users" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Users
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                  <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                  Admin
                </Badge>
              </div>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="hidden md:flex hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Logout
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
              <div className="py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                <p className="text-xs text-muted-foreground">{adminUser.email}</p>
              </div>
              <Link to="/admin/dashboard" className="block py-2 text-primary transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/admin/products" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Products
              </Link>
              <Link to="/admin/categories" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Categories
              </Link>
              <Link to="/admin/orders" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Orders
              </Link>
              <Link to="/admin/users" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Users
              </Link>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Welcome back, {adminUser.username}!
            </h2>
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground animate-pulse">
              Online
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group overflow-hidden relative animate-fade-in hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-foreground group-hover:text-primary transition-colors">1,234</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <p className="text-xs text-primary font-semibold">+12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 hover:border-secondary hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 group overflow-hidden relative animate-fade-in hover:scale-105" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <div className="p-2 bg-secondary/10 rounded-lg group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-foreground group-hover:text-secondary transition-colors">856</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3 h-3 text-secondary" />
                <p className="text-xs text-secondary font-semibold">+8% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30 hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group overflow-hidden relative animate-fade-in hover:scale-105" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-foreground group-hover:text-accent transition-colors">142</div>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-3 h-3 text-accent" />
                <p className="text-xs text-accent font-semibold">+5 new this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group overflow-hidden relative animate-fade-in hover:scale-105" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">₹2.4L</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <p className="text-xs text-primary font-semibold">+15% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Latest orders from your store</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { id: 1001, name: "Rajesh Kumar", amount: 4250, status: "completed" },
                  { id: 1002, name: "Priya Singh", amount: 2890, status: "processing" },
                  { id: 1003, name: "Amit Patel", amount: 5670, status: "pending" },
                  { id: 1004, name: "Sneha Reddy", amount: 1950, status: "completed" }
                ].map((order, i) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300 group hover:scale-[1.02]" style={{ animationDelay: `${500 + i * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <ShoppingCart className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-primary text-lg">₹{order.amount}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            order.status === 'completed' ? 'bg-primary/10 text-primary border-primary/30' :
                            order.status === 'processing' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                            'bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {order.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                           order.status === 'processing' ? <Clock className="w-3 h-3 mr-1" /> :
                           <AlertCircle className="w-3 h-3 mr-1" />}
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '500ms' }}>
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your store efficiently</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button 
                onClick={() => navigate('/admin/products')}
                className="w-full h-14 bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 group bg-[length:200%_100%] hover:bg-[position:100%_0] animate-shimmer text-lg font-bold"
              >
                <Package className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Add New Product
              </Button>
              <Button variant="outline" className="w-full h-12 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full h-12 border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group">
                <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View All Orders
              </Button>
              <Button variant="outline" className="w-full h-12 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all duration-300 group">
                <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Analytics Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
