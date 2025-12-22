import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Eye, Sparkles, Star } from "lucide-react";
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

const Offers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    fetchOfferProducts();
  }, []);

  const fetchOfferProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('category', '%offer%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching offer products:', error);
      toast({
        title: "Error",
        description: "Failed to load offer products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit || "Box",
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <Badge variant="outline" className="text-primary border-primary/50 px-4 py-1.5 bg-primary/5 text-sm">
              🎁 Special Offers
            </Badge>
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Exclusive Deals & Offers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing discounts on premium fireworks
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-secondary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">Loading special offers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 animate-fade-in">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border-2 border-primary/20">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No offers available</h3>
            <p className="text-muted-foreground mb-6">Check back soon for exciting deals!</p>
            <Button onClick={() => navigate('/shop')}>Browse All Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in bg-card relative"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm border border-border shadow-md text-xs"
                    >
                      🎁 {product.unit || "Box"}
                    </Badge>
                    
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

                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-border"></div>
              <span className="text-sm font-medium">
                Showing {products.length} special {products.length === 1 ? 'offer' : 'offers'}
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-border"></div>
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Offers;
