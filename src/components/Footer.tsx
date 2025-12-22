import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import drummerMan from "@/assets/drummer-clean.png";

const Footer = () => {
  return (
    <footer className="relative bg-red-600 overflow-hidden">
      {/* Drummer positioned to align with KR Fireworks text */}
      <div className="absolute top-8 left-8 z-20 hidden lg:flex items-start">
        <img 
          src={drummerMan} 
          alt="KR Fireworks Drummer" 
          className="h-56 w-auto object-contain"
        />
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 lg:pl-56">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">KR FIREWORKS</h3>
            </div>
            <p className="text-red-100 text-sm">
              Your trusted source for premium quality Sivakasi fireworks. Bringing joy and sparkle to your celebrations since 2010.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400 hover:bg-red-700">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400 hover:bg-red-700">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-yellow-400 hover:bg-red-700">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Shop All Products
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Combo Offers
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Policies</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-red-100 hover:text-yellow-400 transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-100 text-sm">
                  123 Fireworks Street, Sivakasi, Tamil Nadu 626123
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-red-100 hover:text-yellow-400 text-sm">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a href="mailto:info@krfireworks.com" className="text-red-100 hover:text-yellow-400 text-sm">
                  info@krfireworks.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-red-500 text-center lg:pl-56">
          <p className="text-red-100 text-sm">
            © 2024 KR Fireworks. All rights reserved. | Authentic Sivakasi Crackers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
