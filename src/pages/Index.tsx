import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurCollections from "@/components/OurCollections";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import FireworksBurst from "@/components/FireworksBurst";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Sparkles, Star, Loader2, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const searchQuery = searchParams.get('search');
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    setLoadingResults(true);
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      if (data) {
        const lowerQuery = query.toLowerCase().trim();
        const filtered = data.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.price.toString().includes(lowerQuery)
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoadingResults(false);
    }
  };

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

  const clearSearch = () => {
    setSearchParams({});
    setSearchResults([]);
    setIsSearching(false);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FireworksBurst />
      <Navbar />

      {/* Search Results Section */}
      {isSearching && (
        <section className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              Search Results for "{searchQuery}"
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({searchResults.length} found)
              </span>
            </h2>
            <Button variant="ghost" onClick={clearSearch} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          </div>

          {loadingResults ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader className="p-0 relative">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={getPrimaryImage(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Floating badges */}
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm shadow-sm text-[10px]"
                      >
                        {product.unit || "Box"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-red-600 text-lg">{product.price}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-gold text-red-700 font-bold border-0 hover:opacity-90 text-xs"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No products found matching "{searchQuery}"</p>
              <Button variant="link" onClick={clearSearch} className="mt-2 text-primary">
                View all collections
              </Button>
            </div>
          )}
          <div className="my-8 border-b border-border" />
        </section>
      )}

      {/* Only show Hero if not searching, or show it below? User said "come to main page". 
          Usually search results replace main content or sit on top. 
          Let's keep Hero visible but maybe scroll to results? 
          Actually, replacing Hero might be too drastic. I'll put results ABOVE Hero.
      */}

      {!isSearching && <Hero />}
      <OurCollections />
      <Services />

      <Footer />
    </div>
  );
};

export default Index;
