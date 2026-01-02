import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Package, Search, Plus, Edit, Trash2, Menu, Filter, ArrowUpDown, Upload, X, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import krLogo from "@/assets/kr-fireworks-logo.png";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status?: "in_stock" | "low_stock" | "out_of_stock";
  description?: string;
  image?: string;
  unit?: string;
  created_at?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

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

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  // Filter and Sort State
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product | 'price_num'; direction: 'asc' | 'desc' } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    unit: "Box",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // ... (keeping useEffect and auth logic same)
  useEffect(() => {
    checkAdminAuth();
  }, [navigate]);

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/admin');
      return;
    }

    // Verify user is admin
    const { data: isAdminData } = await supabase.rpc('is_admin', {
      _user_id: session.user.id
    });

    if (!isAdminData) {
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

    // Get admin details
    const { data: adminDetails } = await supabase
      .from('admin')
      .select('username, email')
      .eq('user_id', session.user.id)
      .maybeSingle();

    setAdminUser({
      id: session.user.id,
      username: adminDetails?.username || 'Admin',
      email: adminDetails?.email || session.user.email
    });

    fetchCategories();
    fetchProducts();
  };

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
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (keeping image handlers and CRUD functions same)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: formData.price,
          stock: parseInt(formData.stock),
          unit: formData.unit,
          image: imagePreviews.length > 0 ? JSON.stringify(imagePreviews) : null,
        }]);

      if (error) throw error;

      await fetchProducts();
      setIsAddDialogOpen(false);
      setFormData({ name: "", category: "", description: "", price: "", stock: "", unit: "Box" });
      setImagePreviews([]);

      toast({
        title: "Product Added",
        description: `${formData.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.category || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: formData.price,
          stock: parseInt(formData.stock),
          unit: formData.unit,
          image: imagePreviews.length > 0 ? JSON.stringify(imagePreviews) : null,
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      await fetchProducts();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setFormData({ name: "", category: "", description: "", price: "", stock: "", unit: "Box" });
      setImagePreviews([]);

      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Product Deleted",
        description: `${product.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: product.price,
      stock: product.stock.toString(),
      unit: product.unit || "Box",
    });
    setImagePreviews(parseProductImages(product.image));
    setIsEditDialogOpen(true);
  };

  const getProductStatus = (stock: number) => {
    if (stock === 0) return "out_of_stock";
    if (stock < 30) return "low_stock";
    return "in_stock";
  };

  // Updated Filter and Sort Logic
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;

      let valA: any = a[key as keyof Product];
      let valB: any = b[key as keyof Product];

      // Special handling for price (string -> number)
      if (key === 'price_num') {
        // Remove currency symbol and parse
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
        valA = isNaN(priceA) ? 0 : priceA;
        valB = isNaN(priceB) ? 0 : priceB;
      }

      if (valA < valB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key: keyof Product | 'price_num') => {
    setSortConfig(current => {
      if (current?.key === key) {
        // Toggle direction
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Admin Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex flex-col items-start gap-1 select-none">
              <img
                src={krLogo}
                alt="KR Fireworks"
                className="h-10 md:h-12 object-contain"
              />
              <p className="text-sm font-semibold text-red-600 italic tracking-wide font-serif">
                'n' joy with Every moments...
              </p>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/products" className="text-primary transition-all duration-300 font-medium relative">
                Products
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              </Link>
              <Link to="/admin/categories" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/orders" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/users" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Users
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                  <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                  Admin
                </Badge>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="hidden md:flex hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Logout
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
              <div className="py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                <p className="text-xs text-muted-foreground">{adminUser.email}</p>
              </div>
              <Link to="/admin/dashboard" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/admin/products" className="block py-2 text-primary transition-colors font-medium">
                Products
              </Link>
              <Link to="/admin/categories" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Categories
              </Link>
              <Link to="/admin/orders" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Orders
              </Link>
              <Link to="/admin/users" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Users
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Products Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                Products Management
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg">Manage your fireworks inventory</p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 shadow-lg shadow-primary/20 group bg-[length:200%_100%] hover:bg-[position:100%_0]"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Add Product
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <Card className="border-border/50 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                <div className="flex gap-2 w-full">
                  {/* Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className={`flex-1 border-primary/30 hover:border-primary ${filterCategory !== 'all' ? 'bg-primary/10 text-primary border-primary' : ''}`}>
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="truncate">{filterCategory === 'all' ? 'Filter' : filterCategory}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Categories</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                        {filterCategory === 'all' && <Check className="w-4 h-4 mr-2 text-primary" />}
                        All Categories
                      </DropdownMenuItem>
                      {categories.map((category) => (
                        <DropdownMenuItem key={category.id} onClick={() => setFilterCategory(category.name)}>
                          {filterCategory === category.name && <Check className="w-4 h-4 mr-2 text-primary" />}
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className={`flex-1 border-primary/30 hover:border-primary ${sortConfig ? 'bg-primary/10 text-primary border-primary' : ''}`}>
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSort('price_num')}>
                        Price {sortConfig?.key === 'price_num' && (sortConfig.direction === 'asc' ? '(Low-High)' : '(High-Low)')}
                        {sortConfig?.key === 'price_num' && <Check className="ml-auto w-4 h-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('stock')}>
                        Stock {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? '(Low-High)' : '(High-Low)')}
                        {sortConfig?.key === 'stock' && <Check className="ml-auto w-4 h-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('name')}>
                        Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        {sortConfig?.key === 'name' && <Check className="ml-auto w-4 h-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Products Content */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <Card className="hidden md:block border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          All Products
                        </CardTitle>
                        <CardDescription>Total: {filteredProducts.length} products</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-muted/50">
                          <TableHead className="font-bold text-foreground">Product Name</TableHead>
                          <TableHead className="font-bold text-foreground">Category</TableHead>
                          <TableHead className="font-bold text-foreground">Price</TableHead>
                          <TableHead className="font-bold text-foreground">Stock</TableHead>
                          <TableHead className="font-bold text-foreground">Status</TableHead>
                          <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => {
                          const status = getProductStatus(product.stock);
                          return (
                            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-muted/50">
                                  {product.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-bold text-primary">{product.price}</TableCell>
                              <TableCell className="text-foreground">{product.stock} units</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`${status === 'in_stock' ? 'bg-primary/10 text-primary border-primary/30' :
                                    status === 'low_stock' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                                      'bg-destructive/10 text-destructive border-destructive/30'
                                    }`}
                                >
                                  {status === 'in_stock' ? 'In Stock' :
                                    status === 'low_stock' ? 'Low Stock' :
                                      'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(product)}
                                    className="hover:bg-primary/10 hover:text-primary group"
                                  >
                                    <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteProduct(product)}
                                    className="hover:bg-destructive/10 hover:text-destructive group"
                                  >
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredProducts.map((product) => {
                    const status = getProductStatus(product.stock);
                    const images = parseProductImages(product.image);
                    const mainImage = images[0];

                    return (
                      <Card key={product.id} className="border-border/50 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Product Image (Left) */}
                            <div className="w-24 h-24 bg-muted shrink-0">
                              {mainImage ? (
                                <img
                                  src={mainImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <Package className="w-8 h-8 opacity-20" />
                                </div>
                              )}
                            </div>

                            {/* Product Details (Right) */}
                            <div className="flex-1 p-3 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-bold text-foreground line-clamp-1">{product.name}</h3>
                                  <Badge variant="outline" className="text-[10px] px-1.5 h-5 bg-muted/50">
                                    {product.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm mb-1">
                                  <span className="font-bold text-primary">{product.price}</span>
                                  <span className="text-muted-foreground text-xs">•</span>
                                  <span className="text-muted-foreground text-xs">{product.stock} {product.unit}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 h-5 ${status === 'in_stock' ? 'bg-primary/10 text-primary border-primary/30' :
                                    status === 'low_stock' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                                      'bg-destructive/10 text-destructive border-destructive/30'
                                    }`}
                                >
                                  {status === 'in_stock' ? 'In Stock' :
                                    status === 'low_stock' ? 'Low Stock' :
                                      'Out of Stock'}
                                </Badge>

                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(product)}
                                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteProduct(product)}
                                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Rocket Sparklers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-semibold">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-semibold">Description</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-border focus:border-primary min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground font-semibold">Price *</Label>
                <Input
                  id="price"
                  placeholder="₹250"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-foreground font-semibold">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="100"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-foreground font-semibold">Unit *</Label>
                <Input
                  id="unit"
                  placeholder="Box"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-foreground font-semibold">Product Images</Label>
              <div className="space-y-3">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> images
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB each)</p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="bg-gradient-to-r from-primary to-secondary">
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Edit Product
            </DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-foreground font-semibold">Product Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-foreground font-semibold">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-foreground font-semibold">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-border focus:border-primary min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-foreground font-semibold">Price *</Label>
                <Input
                  id="edit-price"
                  placeholder="₹250"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock" className="text-foreground font-semibold">Stock *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit" className="text-foreground font-semibold">Unit *</Label>
                <Input
                  id="edit-unit"
                  placeholder="Box"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image" className="text-foreground font-semibold">Product Images</Label>
              <div className="space-y-3">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="edit-image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> images
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB each)</p>
                    </div>
                    <input
                      id="edit-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} className="bg-gradient-to-r from-primary to-secondary">
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
