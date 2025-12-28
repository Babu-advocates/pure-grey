import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <img
              src="/logo.png"
              alt="KR Fireworks Logo"
              className="w-8 h-8 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-black speed-text bg-gradient-gold bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                KR FIREWORKS
              </h1>
              <p className="text-[10px] md:text-xs text-red-600 font-medium group-hover:text-red-500 transition-colors">'n' joy with Every moments...</p>
            </div>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink to="/shop" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink to="/combos" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Combos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink to="/offers" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Offers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink to="/safety" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Safety
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink to="/contact" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavLink>
          </div>

          {/* Cart, Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            <CartDrawer />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-primary/10">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="hidden md:flex bg-gradient-gold hover:opacity-90 transition-opacity"
              >
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
            <NavLink to="/" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Home
            </NavLink>
            <NavLink to="/shop" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </NavLink>
            <NavLink to="/combos" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Combos
            </NavLink>
            <NavLink to="/offers" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Offers
            </NavLink>
            <NavLink to="/safety" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Safety
            </NavLink>
            <NavLink to="/contact" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                  My Profile
                </NavLink>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-gold hover:opacity-90 transition-opacity mt-2"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
