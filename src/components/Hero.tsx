import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fireworks.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Hero Image - using img tag for proper responsive sizing */}
      <img
        src={heroImage}
        alt="KR Fireworks Banner"
        className="w-full h-auto object-contain"
      />

      {/* SHOP NOW Button - positioned to the right, below Quality text */}
      <div className="absolute bottom-[15%] sm:bottom-[22%] right-[22%] z-10">
        <Button
          onClick={() => navigate('/shop')}
          className="text-[10px] sm:text-sm md:text-xl px-3 sm:px-6 md:px-12 py-1 sm:py-2 md:py-5 h-auto bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-bold rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-amber-400/50 sm:border-2 hover:shadow-[0_6px_25px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-300"
        >
          SHOP NOW
        </Button>
      </div>
    </section>
  );
};

export default Hero;


