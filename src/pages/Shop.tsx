import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Eye, Sparkles, Zap, Star } from "lucide-react";
import { categories as allCategories } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  unit: string;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addItem } = useCart();

  const getPrimaryImage = (image: string | null | undefined) => {
    if (!image) return "";
    try {
      const parsed = JSON.parse(image);
      if (Array.isArray(parsed)) return parsed[0] || "";
      if (typeof parsed === "string") return parsed;
      return image;
    } catch {
      return image;
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getPrimaryImage(product.image),
      unit: product.unit || "Box",
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      
      // Calculate categories with product counts
      const categoryCounts: Record<string, number> = {};
      data?.forEach(product => {
        // Normalize category for matching (lowercase, replace spaces with hyphens)
        const normalizedCategory = product.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
        categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
      });

      // Filter categories to only show those with products
      const availableCategories = allCategories
        .filter(cat => cat.id === "all" || categoryCounts[cat.id] > 0)
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          count: cat.id === "all" ? data?.length || 0 : categoryCounts[cat.id] || 0
        }));

      setCategories(availableCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => {
        const normalizedCategory = p.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
        return normalizedCategory === selectedCategory;
      });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-40" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-ping opacity-40" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping opacity-40" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-primary rounded-full animate-ping opacity-40" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}></div>
        <Sparkles className="absolute top-32 right-40 w-8 h-8 text-primary/10 animate-pulse" style={{ animationDuration: '2s' }} />
        <Sparkles className="absolute bottom-60 left-40 w-6 h-6 text-secondary/10 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <Star className="absolute top-1/2 left-20 w-6 h-6 text-accent/10 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <Badge variant="outline" className="text-primary border-primary/50 px-4 py-1.5 bg-primary/5 text-sm">
              🎆 Premium Crackers & Fireworks
            </Badge>
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 relative">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Light Up Your Celebrations
            </span>
            <Zap className="inline-block w-10 h-10 text-primary ml-3 animate-bounce" />
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Discover premium quality fireworks for unforgettable moments
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <Star className="w-4 h-4 text-primary fill-primary" />
            <Star className="w-4 h-4 text-primary fill-primary" />
            <Star className="w-4 h-4 text-primary fill-primary" />
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="ml-2">Trusted by thousands of happy customers</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-6xl mx-auto">
            {categories.map((cat, index) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
                className={`group relative overflow-hidden transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? "bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/20 border-0 text-primary-foreground" 
                    : "hover:border-primary/50 hover:shadow-md hover:bg-primary/5 border-border/50"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="relative z-10 font-medium flex items-center gap-2 text-sm">
                  {selectedCategory === cat.id && <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
                  {cat.name}
                  {cat.count > 0 && (
                    <span className="text-xs opacity-70 font-normal">({cat.count})</span>
                  )}
                </span>
                {selectedCategory === cat.id && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 animate-shimmer" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-secondary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">Loading amazing products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 animate-fade-in">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border-2 border-primary/20">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in bg-card relative"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Sparkle decoration */}
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={getPrimaryImage(product.image)}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() => navigate(`/product/${product.id}`)}
                      onError={(e) => {
                        // avoid infinite loop if placeholder is missing
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Floating badges */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm border border-border shadow-md text-xs"
                    >
                      🎁 {product.unit || "Box"}
                    </Badge>
                    
                    {/* Stock indicator */}
                    {product.stock > 0 && (
                      <Badge 
                        variant="outline" 
                        className="absolute bottom-3 left-3 bg-primary text-primary-foreground border-0 backdrop-blur-sm text-xs"
                      >
                        ✨ In Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-5">
                  <CardTitle className="mb-2 text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-0.5">Price</span>
                      <span className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        {product.price}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex gap-0.5">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 flex gap-2">
                  <Button 
                    size="sm"
                    className="flex-1 group/btn border-border hover:border-primary hover:bg-primary/5" 
                    variant="outline"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-xs">View</span>
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-md hover:shadow-primary/20 transition-all group/btn border-0 text-primary-foreground" 
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5 group-hover/btn:rotate-12 transition-transform" />
                    <span className="text-xs">Add to Cart</span>
                  </Button>
                </CardFooter>

                {/* Animated corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-border"></div>
              <span className="text-sm font-medium">
                Showing {filteredProducts.length} premium {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-border"></div>
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
            </div>
          </div>
        )}

        {/* Safety Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-6 border border-border animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Safety First!</h3>
            <Zap className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto">
            Always follow safety guidelines when using fireworks. Keep a safe distance, never point at people or animals, and have water nearby. Happy celebrations! 🎆
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
