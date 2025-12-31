import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Eye, Sparkles, Zap, Star, Filter, SlidersHorizontal, X } from "lucide-react";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [showFilters, setShowFilters] = useState(false);
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

  const [searchQuery, setSearchQuery] = useState("");

  // Handle category and search from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');

    if (categoryFromUrl) {
      setSelectedCategory("");
      setSelectedCategories([categoryFromUrl]);
    }

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    } else {
      setSearchQuery("");
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

      // Calculate price range from products
      if (data && data.length > 0) {
        const prices = data.map(p => parsePrice(p.price)).filter(p => p > 0);
        if (prices.length > 0) {
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices)
          });
        }
      }

      // Calculate categories with product counts from database (dynamic)
      const categoryCounts: Record<string, { name: string; count: number }> = {};
      data?.forEach(product => {
        const categoryName = product.category;
        const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[()]/g, '');
        if (!categoryCounts[normalizedCategory]) {
          categoryCounts[normalizedCategory] = { name: categoryName, count: 0 };
        }
        categoryCounts[normalizedCategory].count += 1;
      });

      // Create categories array from database data
      const dbCategories: Category[] = [
        { id: "all", name: "All Products", count: data?.length || 0 },
        ...Object.entries(categoryCounts).map(([id, { name, count }]) => ({
          id,
          name,
          count
        }))
      ];

      setCategories(dbCategories);
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

  // Parse price string to number (e.g., "₹1,499" -> 1499)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const numStr = priceStr.replace(/[₹,\s]/g, '');
    return parseFloat(numStr) || 0;
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories([]);
      setSelectedCategory("all");
    } else {
      setSelectedCategory(""); // Clear single select
      setSelectedCategories(prev =>
        prev.includes(categoryId)
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    navigate("/shop"); // Clear URL params
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategories.length > 0 || minPrice !== "" || maxPrice !== "" || searchQuery !== "";

  // Filter products based on categories, price, and search query
  const filteredProducts = products.filter(p => {
    // Category filter
    const productCategory = p.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[()]/g, '');
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(selected =>
      productCategory.includes(selected) || selected.includes(productCategory)
    );

    // Price filter
    const productPrice = parsePrice(p.price);
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const priceMatch = productPrice >= minPriceNum && productPrice <= maxPriceNum;

    // Search filter (Product Name, Category, Price)
    const query = searchQuery.toLowerCase().trim();
    const searchMatch = query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.price.toString().includes(query);

    return categoryMatch && priceMatch && searchMatch;
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

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <Badge variant="outline" className="text-primary border-primary/50 px-4 py-1.5 bg-primary/5 text-sm">
              🎆 Premium Crackers & Fireworks
            </Badge>
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 relative">
            <span className="text-red-600">Light Up </span>
            <span className="text-red-600">
              Your Celebrations
            </span>
            <Zap className="inline-block w-6 h-6 sm:w-10 sm:h-10 text-primary ml-2 sm:ml-3 animate-bounce" />
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

        {/* Filter Section */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Filter Toggle Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {hasActiveFilters && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">Active</Badge>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 max-w-4xl mx-auto shadow-lg animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-red-600" />
                  Filter Products
                </h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={
                        (cat.id === "all" && selectedCategories.length === 0) ||
                          selectedCategories.includes(cat.id)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleCategory(cat.id)}
                      size="sm"
                      className={`transition-all duration-300 ${(cat.id === "all" && selectedCategories.length === 0) ||
                        selectedCategories.includes(cat.id)
                        ? "bg-yellow-400 text-red-600 hover:bg-yellow-500 border-0"
                        : "hover:border-red-400 hover:text-red-600"
                        }`}
                    >
                      {cat.name}
                      <span className="ml-1 text-xs opacity-70">({cat.count})</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Section */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Price Range (₹{priceRange.min} - ₹{priceRange.max})
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Min:</span>
                    <input
                      type="number"
                      placeholder={priceRange.min.toString()}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-28 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Max:</span>
                    <input
                      type="number"
                      placeholder={priceRange.max.toString()}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-28 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Summary */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-red-600">{filteredProducts.length}</span> products
                    {selectedCategories.length > 0 && (
                      <> in <span className="font-medium">{selectedCategories.length}</span> {selectedCategories.length === 1 ? 'category' : 'categories'}</>
                    )}
                    {(minPrice || maxPrice) && (
                      <> with price {minPrice && <>from ₹{minPrice}</>}{maxPrice && <> to ₹{maxPrice}</>}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Category Pills (always visible) */}
          <div className="flex flex-wrap gap-2.5 justify-center max-w-6xl mx-auto mt-4">
            {categories.slice(0, 8).map((cat) => (
              <Button
                key={cat.id}
                variant={
                  (cat.id === "all" && selectedCategories.length === 0) ||
                    selectedCategories.includes(cat.id)
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleCategory(cat.id)}
                size="sm"
                className={`group relative overflow-hidden transition-all duration-300 ${(cat.id === "all" && selectedCategories.length === 0) ||
                  selectedCategories.includes(cat.id)
                  ? "bg-yellow-400 shadow-lg shadow-yellow-400/20 border-0 text-red-600 hover:bg-yellow-500"
                  : "hover:border-primary/50 hover:shadow-md hover:bg-primary/5 border-border/50"
                  }`}
              >
                <span className="relative z-10 font-medium flex items-center gap-2 text-sm">
                  {((cat.id === "all" && selectedCategories.length === 0) || selectedCategories.includes(cat.id)) && (
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  )}
                  {cat.name}
                  {cat.count > 0 && (
                    <span className="text-xs opacity-70 font-normal">({cat.count})</span>
                  )}
                </span>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-background/95 backdrop-blur-sm border border-border shadow-md text-[10px] sm:text-xs"
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

                <CardContent className="p-3 sm:p-5">
                  <CardTitle className="mb-1 sm:mb-2 text-sm sm:text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-[10px] sm:text-xs mb-2 sm:mb-4 line-clamp-2 leading-relaxed hidden sm:block">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 hidden sm:block">Price</span>
                      <span className="text-lg sm:text-2xl font-black text-red-600">
                        {product.price}
                      </span>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
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

                <CardFooter className="p-3 sm:p-5 pt-0 flex gap-1 sm:gap-2">
                  <Button
                    size="sm"
                    className="flex-1 group/btn border-border hover:border-primary hover:bg-primary/5 px-2 sm:px-3"
                    variant="outline"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] sm:text-xs hidden sm:inline">View</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 hover:shadow-md transition-all group/btn border-0 text-red-600 font-semibold px-2 sm:px-3"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5 group-hover/btn:rotate-12 transition-transform" />
                    <span className="text-[10px] sm:text-xs hidden sm:inline">Add to Cart</span>
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
