import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Gift, MapPin, ShieldCheck, Percent, ArrowRight } from "lucide-react";

const PromotionalBanners = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Card 1 - Daily Offers */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-6 min-h-[240px] cursor-pointer hover:scale-[1.03] transition-all duration-500 shadow-xl group" 
            onClick={() => navigate('/offers')}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--secondary)) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
            </div>
            
            <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-black animate-bounce-in shadow-lg">
              NEW
            </div>
            <div className="relative z-10">
              <h3 className="text-primary-foreground font-black text-2xl md:text-3xl leading-tight">
                ANY DAY
              </h3>
              <h4 className="text-secondary font-black text-3xl md:text-4xl mb-3 drop-shadow-[0_0_10px_hsl(var(--secondary)/0.5)]">
                OFFERS
              </h4>
              <p className="text-primary-foreground/80 text-sm mb-4">Special discounts everyday!</p>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full font-black shadow-lg group-hover:shadow-[0_0_20px_hsl(var(--secondary)/0.5)] transition-shadow">
                <Percent className="w-4 h-4" />
                Up to 40% OFF
              </div>
            </div>
            <Sparkles className="absolute right-4 bottom-4 w-24 h-24 text-primary-foreground/10 group-hover:text-primary-foreground/20 group-hover:scale-110 transition-all duration-500" />
          </div>

          {/* Card 2 - Gift Boxes */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent to-foreground/80 p-6 min-h-[240px] cursor-pointer hover:scale-[1.03] transition-all duration-500 shadow-xl group" 
            onClick={() => navigate('/shop?category=gift-boxes')}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative z-10">
              <h3 className="text-accent-foreground font-black text-2xl md:text-3xl leading-tight">
                GIFT
              </h3>
              <h4 className="text-secondary font-black text-3xl md:text-4xl mb-3 drop-shadow-[0_0_10px_hsl(var(--secondary)/0.5)]">
                BOXES
              </h4>
              <p className="text-accent-foreground/80 text-sm mb-4">Perfect for gifting celebrations!</p>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full font-black shadow-lg">
                From ₹499
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <Gift className="absolute right-4 bottom-4 w-24 h-24 text-accent-foreground/10 group-hover:text-accent-foreground/20 group-hover:rotate-12 transition-all duration-500" />
          </div>

          {/* Card 3 - Find Store */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-card border-2 border-border p-6 min-h-[240px] cursor-pointer hover:scale-[1.03] hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-500 shadow-lg group" 
            onClick={() => navigate('/contact')}
          >
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h3 className="text-foreground font-black text-2xl md:text-3xl leading-tight">
                FIND A
              </h3>
              <h4 className="text-primary font-black text-3xl md:text-4xl mb-3 drop-shadow-[0_0_10px_hsl(var(--primary)/0.3)]">
                STORE
              </h4>
              <p className="text-muted-foreground text-sm mb-4">Locate your nearest KR Fireworks</p>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 rounded-full px-6 font-bold shadow-lg group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-shadow">
                NEAR ME
                <MapPin className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <MapPin className="absolute right-4 bottom-4 w-24 h-24 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 transition-all duration-500" />
          </div>
        </div>

        {/* Bottom Row - 2 Wide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 4 - Premium Collection */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent via-foreground/90 to-accent p-6 min-h-[200px] cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-xl group" 
            onClick={() => navigate('/shop?category=deluxe-crackers')}
          >
            {/* Animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 animate-shimmer" />
            
            <div className="relative z-10">
              <h3 className="text-accent-foreground font-black text-2xl md:text-3xl mb-1">PREMIUM</h3>
              <h4 className="text-secondary font-black text-3xl md:text-4xl mb-4 drop-shadow-[0_0_15px_hsl(var(--secondary)/0.5)]">COLLECTION</h4>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full font-black text-sm shadow-lg">
                <ShieldCheck className="w-4 h-4" />
                100% AUTHENTIC SIVAKASI
              </div>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl font-black text-accent-foreground/5 group-hover:text-accent-foreground/10 transition-colors">
              DELUXE
            </div>
          </div>

          {/* Card 5 - Safe Crackers */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary via-secondary to-secondary/80 p-6 min-h-[200px] cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-xl group" 
            onClick={() => navigate('/safety')}
          >
            {/* Pulse effect */}
            <div className="absolute inset-0 bg-primary/10 animate-glow-pulse rounded-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-secondary-foreground font-black text-2xl md:text-3xl mb-1">DO YOU WANT</h3>
              <h4 className="text-primary font-black text-3xl md:text-4xl mb-4 drop-shadow-[0_0_10px_hsl(var(--primary)/0.3)]">SAFE CRACKERS?</h4>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-shadow">
                SEE SAFETY GUIDE
                <ShieldCheck className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl font-black text-secondary-foreground/5 group-hover:text-secondary-foreground/10 transition-colors">
              SAFE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
