import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Users, Menu, Search, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAdminAuth();
  }, [navigate]);

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: isAdminData } = await supabase.rpc('is_admin', {
      _user_id: session.user.id
    });

    if (!isAdminData) {
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

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

  // Sample users data
  const users = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", joined: "2024-01-15", orders: 12, status: "active" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", joined: "2024-02-20", orders: 8, status: "active" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", joined: "2024-03-10", orders: 5, status: "inactive" },
    { id: 4, name: "Sneha Reddy", email: "sneha@example.com", joined: "2024-04-05", orders: 15, status: "active" },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Admin Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-destructive/30 shadow-lg shadow-destructive/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
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
              <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
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
              <Link to="/admin/users" className="text-primary transition-all duration-300 font-medium relative">
                Users
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              </Link>
            </div>

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

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
              <div className="py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                <p className="text-xs text-muted-foreground">{adminUser.email}</p>
              </div>
              <Link to="/admin/dashboard" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
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
              <Link to="/admin/users" className="block py-2 text-primary transition-colors font-medium">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-black">
              <span className="text-foreground">Users </span>
              <span className="text-primary">Management</span>
            </h2>
            <p className="text-muted-foreground mt-1">Manage your customer accounts</p>
          </div>
        </div>

        {/* Search */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10 bg-muted/30 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Users
              <Badge variant="outline" className="ml-2">
                Total: {filteredUsers.length} users
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-muted-foreground">Orders</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {user.joined}
                      </div>
                    </TableCell>
                    <TableCell className="text-primary font-semibold">{user.orders}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.status === 'active' 
                          ? 'bg-primary/10 text-primary border-primary/30' 
                          : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUsers;
