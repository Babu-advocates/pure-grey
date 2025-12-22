import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame, Rocket, FlowerIcon, Sparkles, Package, Gift, Lightbulb, Zap, Sparkle, Bomb, Star, Box, Circle, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  "Sparklers": Sparkles,
  "Rockets": Rocket,
  "Flower Pots": FlowerIcon,
  "Ground Chakkars": Flame,
  "Combo Packs": Package,
  "Family Boxes": Gift,
  "Night Sky": Lightbulb,
  "Fountains": Zap,
  "Candles & Pencils": Sparkle,
  "Twinkling Stars": Star,
  "Bombs": Bomb,
  "Single Shot Crackers": Circle,
  "Electric Crackers": Zap,
  "Deluxe Crackers": Crown,
  "Giant Crackers": Bomb,
  "Fancy Items": Sparkle,
  "Aerial Items": Rocket,
  "Penta": Star,
  "Mini Series": Box,
  "Multiple Aerial": Rocket,
  "Fancy Novelties": Gift,
  "Single Sound": Circle,
  "Fancy Shots": Sparkles,
  "Mega Multi Colour Shots": Crown,
  "Special Items": Star,
  "Gift Boxes": Gift,
  "Novelty Items": Box,
  "Sparklers (cm sizes)": Sparkles,
};

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getIconForCategory = (categoryName: string): LucideIcon => {
    return iconMap[categoryName] || Sparkles;
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryParam = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[()]/g, '');
    navigate(`/shop?category=${categoryParam}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8">
          <button 
            onClick={() => navigate('/shop')}
            className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground px-10 py-4 rounded-full font-black text-lg shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:scale-105 transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">EXPLORE MENU</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Horizontal Scrollable Categories */}
        <div className="relative">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-card rounded-full shadow-xl border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories Scroll Container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-14 py-6 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => {
              const Icon = getIconForCategory(category.name);
              const colorVariants = [
                'from-primary to-primary/80',
                'from-accent to-accent/80',
                'from-secondary to-secondary/80',
              ];
              const shadowVariants = [
                'shadow-[0_8px_30px_hsl(var(--primary)/0.3)]',
                'shadow-[0_8px_30px_hsl(var(--accent)/0.3)]',
                'shadow-[0_8px_30px_hsl(var(--secondary)/0.3)]',
              ];
              const colorIndex = index % 3;
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Circular Icon Container */}
                  <div className={`relative w-18 h-18 md:w-22 md:h-22 rounded-full bg-gradient-to-br ${colorVariants[colorIndex]} flex items-center justify-center ${shadowVariants[colorIndex]} group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 p-5`}>
                    {/* Inner glow */}
                    <div className="absolute inset-2 rounded-full bg-primary-foreground/10 blur-sm" />
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground relative z-10 group-hover:animate-bounce-in" strokeWidth={2} />
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-xs font-bold text-center text-foreground max-w-20 md:max-w-24 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {category.name.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-card rounded-full shadow-xl border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
