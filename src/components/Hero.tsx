import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/hero-banner-2.jpg",
    alt: "KR Fireworks Banner"
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden group">
      {/* Carousel Container */}
      <div className="relative w-full">
        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Manual Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-4" : "bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full">
        <img
          src="/hero-border.png"
          alt="Border Decoration"
          className="w-full h-auto object-cover block"
        />
      </div>

      <div className="text-center py-8">
        <h2 className="text-xl md:text-5xl font-black text-red-600 uppercase tracking-widest drop-shadow-sm">
          Our Collections
        </h2>
      </div>
    </section>
  );
};

export default Hero;
