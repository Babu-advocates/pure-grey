import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-fireworks.jpg";
import paisleyPattern from "@/assets/paisley-pattern.png";

const promoSlides = [
  {
    title: "DIWALI MEGA",
    subtitle: "COMBO PACK",
    description: "Premium Sivakasi crackers for your grand celebrations",
    price: "₹2,999",
    originalPrice: "₹4,500",
    badge: "33% OFF",
  },
  {
    title: "FAMILY",
    subtitle: "CELEBRATION BOX",
    description: "Complete fireworks package for the whole family",
    price: "₹1,499",
    originalPrice: "₹2,200",
    badge: "HOT DEAL",
  },
  {
    title: "PREMIUM",
    subtitle: "SKY ROCKETS",
    description: "Experience professional-grade aerial fireworks",
    price: "₹999",
    originalPrice: "₹1,500",
    badge: "BESTSELLER",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);

  const slide = promoSlides[currentSlide];

  return (
    <section
      className="relative min-h-[500px] md:min-h-[600px] overflow-hidden"
      style={{ backgroundColor: "hsl(var(--hero-bg))" }}
    >
      {/* Depth gradient (matches the reference style) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--hero-bg-deep) / 0.55) 0%, hsl(var(--hero-bg) / 0) 45%, hsl(var(--hero-bg-warm) / 0.22) 100%)",
        }}
      />

      {/* Paisley pattern overlay (repeat, visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${paisleyPattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "420px 420px",
          backgroundPosition: "center",
          opacity: 0.24,
          mixBlendMode: "multiply",
          filter: "contrast(1.2) brightness(0.82)",
        }}
      />

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-foreground/20 hover:scale-110 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-primary-foreground group-hover:text-secondary transition-colors" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-foreground/20 hover:scale-110 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 text-primary-foreground group-hover:text-secondary transition-colors" />
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px]">
          {/* Left Content */}
          <div className="space-y-6 text-primary-foreground animate-fade-in-up">
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="inline-block animate-slide-in-left text-secondary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {slide.title}
              </span>
              <br />
              <span className="text-primary-foreground inline-block animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                {slide.subtitle}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-md">
              {slide.description}
            </p>

            {/* Price Box */}
            <div className="flex items-center gap-4">
              <div className="bg-foreground/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-primary-foreground/10">
                <p className="text-sm text-primary-foreground/80">Starting at</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-black text-secondary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {slide.price}
                  </span>
                  <span className="text-xl text-primary-foreground/60 line-through">
                    {slide.originalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                onClick={() => navigate('/shop')} 
                size="lg" 
                className="text-lg px-10 py-6 h-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                ORDER NOW
              </Button>
              <Button 
                onClick={() => navigate('/combos')} 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                View Combos
              </Button>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group">
              {/* Outer dashed ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-foreground/40 scale-[1.15]" />
              
              {/* Inner golden ring */}
              <div className="absolute inset-0 rounded-full border-4 border-secondary/60 scale-105" />
              
              {/* Main image container */}
              <div className="relative w-80 h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-secondary/40 shadow-[0_0_40px_rgba(0,0,0,0.3)] group-hover:shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-shadow duration-500">
                <img 
                  src={heroImage} 
                  alt="Featured Product"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* HOT DEAL Badge */}
              <div className="absolute -top-2 -right-8 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-black text-lg shadow-xl transform rotate-12 animate-bounce-in hover:rotate-0 transition-transform duration-300">
                {slide.badge}
              </div>

              {/* Floating sparkle */}
              <div className="absolute bottom-8 -right-4 animate-sparkle" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-10 bg-primary-foreground shadow-lg' 
                  : 'w-3 bg-primary-foreground/40 hover:bg-primary-foreground/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
