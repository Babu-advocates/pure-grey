import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { products as allProducts } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// Select 4 bestselling products from different categories
const featuredProductIds = [12, 42, 105, 57]; // Flower Pots Deluxe, Lunik Express, Colour Collection, 100 Deluxe
const featuredProducts = featuredProductIds.map(id => allProducts.find(p => p.id === id)!);

const badges = ["Bestseller", "Hot Deal", "New", "Popular"];
const ratings = [4.8, 4.9, 4.7, 5.0];

const FeaturedProducts = () => {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit || 'Box',
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Calculate original price (add ~30% markup for display)
  const getOriginalPrice = (price: string) => {
    const numPrice = parseInt(price.replace('₹', '').replace(',', ''));
    const original = Math.round(numPrice * 1.3);
    return `₹${original.toLocaleString('en-IN')}`;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our most popular fireworks this season
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-[var(--glow-gold)] hover:-rotate-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {badges[index]}
                  </Badge>
                  
                  {/* Glow overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{ratings[index]}</span>
                  <span className="text-muted-foreground">(128 reviews)</span>
                </div>
                
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {getOriginalPrice(product.price)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="festive" 
                  className="w-full group/btn relative overflow-hidden" 
                  size="lg"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
                  <span className="relative z-10">Add to Cart</span>
                  <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </Button>
              </CardFooter>

              {/* Floating sparkles on hover */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-12 group-hover:h-12" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-12 group-hover:h-12" />
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
