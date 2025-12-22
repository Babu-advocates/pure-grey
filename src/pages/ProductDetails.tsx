import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Loader2, ArrowLeft, Package, Shield, Truck, Star, MapPin, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
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

// Pincode validation schema
const pincodeSchema = z.object({
  pincode: z.string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, { message: "Please enter a valid 6-digit pincode" })
    .length(6, { message: "Pincode must be 6 digits" })
});

// Helper to parse images from database (handles both single string and JSON array)
const parseProductImages = (image: string | undefined): string[] => {
  if (!image) return [];
  try {
    const parsed = JSON.parse(image);
    return Array.isArray(parsed) ? parsed : [image];
  } catch {
    return image ? [image] : [];
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState("1");
  const [isSaved, setIsSaved] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from wishlist" : "Added to wishlist",
      description: isSaved 
        ? `${product?.name} removed from your wishlist.`
        : `${product?.name} added to your wishlist.`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || "Product",
      text: `Check out ${product?.name} - ${product?.price}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Thanks for sharing!",
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard!",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSelectLocation = () => {
    setLocationDialogOpen(true);
  };

  const handlePincodeSubmit = () => {
    setPincodeError("");
    
    // Validate pincode
    const validation = pincodeSchema.safeParse({ pincode });
    
    if (!validation.success) {
      setPincodeError(validation.error.errors[0].message);
      return;
    }

    // Mock delivery check - in real app, this would call an API
    const isServiceable = true; // Simulate API response
    
    if (isServiceable) {
      setDeliveryLocation(pincode);
      setLocationDialogOpen(false);
      toast({
        title: "Delivery location set",
        description: `Delivery available to pincode ${pincode}. Expected delivery: 3-5 business days.`,
      });
    } else {
      setPincodeError("Sorry, delivery is not available to this pincode.");
    }
  };

  const handleDeliveryDetails = () => {
    toast({
      title: "Delivery Information",
      description: "Standard delivery: 3-5 business days. Express delivery available at checkout.",
    });
  };

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      const images = parseProductImages(product.image);
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        quantity: parseInt(quantity),
        unit: product.unit,
      });
      
      toast({
        title: "Proceeding to checkout",
        description: `Buying ${quantity} ${product.name}`,
      });
      
      // Navigate to checkout page
      navigate('/checkout');
    }
  };

  // Get parsed images for display
  const productImages = product ? parseProductImages(product.image) : [];
  const currentImage = productImages[selectedImageIndex] || '';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch main product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (productError) throw productError;
      if (!productData) {
        toast({
          title: "Product not found",
          description: "The product you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate('/shop');
        return;
      }

      setProduct(productData);

      // Fetch related products from same category
      const { data: relatedData, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .eq('category', productData.category)
        .neq('id', id)
        .limit(4);

      if (relatedError) throw relatedError;
      setRelatedProducts(relatedData || []);

    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-4 max-w-[1500px]">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm py-3 text-muted-foreground">
          <span 
            className="hover:text-primary hover:underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span>/</span>
          <span 
            className="hover:text-primary hover:underline cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            Shop
          </span>
          <span>/</span>
          <span 
            className="hover:text-primary hover:underline cursor-pointer"
            onClick={() => navigate(`/shop?category=${product.category}`)}
          >
            {product.category}
          </span>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 py-4">
          
          {/* Left: Product Images - 5 columns */}
          <div className="lg:col-span-5">
            <div className="sticky top-4 space-y-4">
              {/* Main Image */}
              <div className="bg-card rounded-lg border overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-8"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-muted">
                    <Package className="w-20 h-20 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <div 
                      key={index}
                      className={`border-2 ${index === selectedImageIndex ? 'border-primary' : 'border-border'} rounded-md overflow-hidden min-w-[60px] h-[60px] cursor-pointer hover:border-primary transition-colors`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={handleSave}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-destructive text-destructive' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={handleShare}
                >
                  <Package className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Middle: Product Info - 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            {/* Product Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-normal leading-tight text-foreground">
                {product.name}
              </h1>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-4 h-4 fill-primary text-primary" 
                  />
                ))}
              </div>
              <span className="text-sm text-primary hover:underline cursor-pointer">
                4.5 out of 5 stars
              </span>
              <span className="text-sm text-muted-foreground">
                (123 ratings)
              </span>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-normal text-foreground">
                  {product.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  per {product.unit || "Box"}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2 py-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Delivery</p>
                  {deliveryLocation ? (
                    <div>
                      <p className="text-sm text-foreground">Pincode: {deliveryLocation}</p>
                      <p 
                        className="text-xs text-primary hover:underline cursor-pointer"
                        onClick={handleSelectLocation}
                      >
                        Change location
                      </p>
                    </div>
                  ) : (
                    <p 
                      className="text-sm text-primary hover:underline cursor-pointer"
                      onClick={handleSelectLocation}
                    >
                      Select delivery location
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    FREE delivery on orders over ₹500
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* About this item */}
            <div className="space-y-2">
              <h2 className="font-bold text-lg">About this item</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Premium Quality - Certified safe products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Original product with authentic packaging</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Fast and secure delivery</span>
              </div>
            </div>
          </div>

          {/* Right: Buy Box - 3 columns */}
          <div className="lg:col-span-3">
            <div className="sticky top-4">
              <Card className="border shadow-lg">
                <CardContent className="p-5 space-y-4">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-normal text-foreground">
                        {product.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      per {product.unit || "Box"}
                    </p>
                  </div>

                  <Separator />

                  {/* Delivery */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="font-medium">FREE delivery</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Order within 2 hrs 30 mins
                    </p>
                    <p 
                      className="text-xs text-primary hover:underline cursor-pointer"
                      onClick={handleDeliveryDetails}
                    >
                      Details
                    </p>
                  </div>

                  <Separator />

                  {/* Stock Status */}
                  <div>
                    {product.stock > 0 ? (
                      <p className="text-lg font-medium text-green-600">In Stock</p>
                    ) : (
                      <p className="text-lg font-medium text-red-600">Out of Stock</p>
                    )}
                    {product.stock > 0 && product.stock <= 10 && (
                      <p className="text-sm text-destructive mt-1">
                        Only {product.stock} left in stock - order soon
                      </p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity:</label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full h-11 bg-primary hover:bg-primary/90" 
                    disabled={product.stock === 0}
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: productImages[0] || '',
                        quantity: parseInt(quantity),
                        unit: product.unit,
                      });
                      toast({
                        title: "Added to cart",
                        description: `${quantity} ${product.name} added to your cart.`,
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  {/* Buy Now Button */}
                  <Button 
                    className="w-full h-11" 
                    variant="secondary"
                    disabled={product.stock === 0}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>

                  <Separator />

                  {/* Secure Transaction */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure transaction</span>
                  </div>

                  {/* Ships From & Sold By */}
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Ships from </span>
                      <span className="font-medium">KR Fireworks</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Sold by </span>
                      <span className="font-medium">KR Fireworks</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="py-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Customer Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="qa" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Questions & Answers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-6 space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-bold mb-3">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                
                <h3 className="text-lg font-bold mb-3 mt-6">Technical Details</h3>
                <table className="w-full max-w-2xl border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 text-sm font-medium w-1/3">Category</td>
                      <td className="py-2 text-sm text-muted-foreground">{product.category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 text-sm font-medium">Unit</td>
                      <td className="py-2 text-sm text-muted-foreground">{product.unit || "Box"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 text-sm font-medium">Availability</td>
                      <td className="py-2 text-sm text-muted-foreground">
                        {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 text-sm font-medium">Brand</td>
                      <td className="py-2 text-sm text-muted-foreground">KR Fireworks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="py-6">
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Customer reviews coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="qa" className="py-6">
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No questions yet. Be the first to ask!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-8 border-t">
            <h2 className="text-2xl font-bold mb-6">
              Products related to this item
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((related) => (
                <Card 
                  key={related.id} 
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer border"
                  onClick={() => {
                    navigate(`/product/${related.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-card overflow-hidden">
                      {(() => {
                        const relatedImages = parseProductImages(related.image);
                        return relatedImages[0] ? (
                          <img
                            src={relatedImages[0]}
                            alt={related.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-muted-foreground" />
                          </div>
                        );
                      })()}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {related.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                      <Star className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {related.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Pincode Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Delivery Location</DialogTitle>
            <DialogDescription>
              Enter your pincode to check delivery availability and estimated delivery time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setPincode(value);
                  setPincodeError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePincodeSubmit();
                  }
                }}
                className={pincodeError ? "border-destructive" : ""}
              />
              {pincodeError && (
                <p className="text-sm text-destructive">{pincodeError}</p>
              )}
            </div>
            <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
              <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">Delivery Information:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Standard delivery: 3-5 business days</li>
                  <li>Express delivery available</li>
                  <li>Free delivery on orders over ₹500</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setLocationDialogOpen(false);
                setPincode("");
                setPincodeError("");
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handlePincodeSubmit}
              disabled={pincode.length !== 6}
            >
              Check Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetails;
