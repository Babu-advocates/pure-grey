import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Tags, Search, Plus, Edit, Trash2, Menu, Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import krLogo from "@/assets/kr-fireworks-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  productCount?: number;
}

const AdminCategories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    color: "",
  });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    checkAdminAuth();
    loadCategoriesWithCounts();
  }, [navigate]);

  const loadCategoriesWithCounts = async () => {
    try {
      setLoading(true);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('category');

      if (productsError) throw productsError;

      const categoryCounts: Record<string, number> = {};
      products?.forEach(product => {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      });

      const categoriesWithCounts = categoriesData?.map(cat => ({
        ...cat,
        productCount: categoryCounts[cat.name] || 0
      })) || [];

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: isAdminData } = await supabase.rpc('is_admin', {
      _user_id: session.user.id
    });

    if (!isAdminData) {
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

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
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadIcon = async (categoryId: string): Promise<string | null> => {
    if (!iconFile) return formData.icon || null;

    setUploading(true);
    try {
      const fileExt = iconFile.name.split('.').pop();
      const fileName = `${categoryId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('category-icons')
        .upload(fileName, iconFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('category-icons')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading icon:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const clearIconSelection = () => {
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // First create the category to get the ID
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: formData.name.trim(),
          icon: null,
          color: formData.color.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      // If there's an icon file, upload it and update the category
      let iconUrl = null;
      if (iconFile) {
        iconUrl = await uploadIcon(data.id);
        const { error: updateError } = await supabase
          .from('categories')
          .update({ icon: iconUrl })
          .eq('id', data.id);

        if (updateError) throw updateError;
      }

      setCategories([...categories, { ...data, icon: iconUrl, productCount: 0 }]);
      setIsAddDialogOpen(false);
      resetForm();

      toast({
        title: "Category Added",
        description: `${data.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      let iconUrl = formData.icon;
      if (iconFile) {
        iconUrl = await uploadIcon(selectedCategory.id);
      }

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name.trim(),
          icon: iconUrl || null,
          color: formData.color.trim() || null,
        })
        .eq('id', selectedCategory.id)
        .select()
        .single();

      if (error) throw error;

      setCategories(categories.map(c =>
        c.id === selectedCategory.id
          ? { ...data, productCount: c.productCount }
          : c
      ));
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      resetForm();

      toast({
        title: "Category Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);

      // Delete icon from storage if it exists
      if (selectedCategory.icon) {
        const fileName = selectedCategory.icon.split('/').pop();
        if (fileName) {
          await supabase.storage.from('category-icons').remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);

      toast({
        title: "Category Deleted",
        description: `${selectedCategory.name} has been deleted successfully.`,
      });

      setSelectedCategory(null);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", icon: "", color: "" });
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "",
      color: category.color || "",
    });
    setIconPreview(category.icon);
    setIconFile(null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Link to="/admin/products" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/categories" className="text-primary transition-all duration-300 font-medium relative">
                Categories
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              </Link>
              <Link to="/admin/orders" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/users" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Users
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/admin/reviews" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                Reviews
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
              <Link to="/admin/products" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Products
              </Link>
              <Link to="/admin/categories" className="block py-2 text-primary transition-colors font-medium">
                Categories
              </Link>
              <Link to="/admin/orders" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Orders
              </Link>
              <Link to="/admin/users" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Users
              </Link>
              <Link to="/admin/reviews" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                Reviews
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

      {/* Categories Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                Categories Management
              </h2>
              <p className="text-muted-foreground text-lg">Manage product categories</p>
            </div>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="border-border/50 mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Tags className="w-5 h-5 text-primary" />
                    All Categories
                  </CardTitle>
                  <CardDescription>Total: {filteredCategories.length} categories</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No categories found. Add your first category!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-bold text-foreground">Icon</TableHead>
                      <TableHead className="font-bold text-foreground">Category Name</TableHead>
                      <TableHead className="font-bold text-foreground">Products</TableHead>
                      <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          {category.icon ? (
                            <img
                              src={category.icon}
                              alt={category.name}
                              className="w-10 h-10 rounded-lg object-cover border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                              <Image className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {category.productCount || 0} items
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(category)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(category)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Add New Category
            </DialogTitle>
            <DialogDescription>
              Create a new category to organize your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Ground Chakkars"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-border focus:border-primary"
              />
            </div>

            {/* Icon Upload */}
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Category Icon (Optional)</Label>
              <div className="flex items-center gap-4">
                {iconPreview ? (
                  <div className="relative">
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-20 h-20 rounded-lg object-cover border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={clearIconSelection}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {iconPreview ? "Change Icon" : "Upload Icon"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Max 2MB, PNG/JPG/WebP</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-foreground font-semibold">Color Class (Optional)</Label>
              <Input
                id="color"
                placeholder="e.g., text-primary, text-secondary"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="border-border focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-border hover:bg-muted"
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={saving || uploading}
            >
              {saving || uploading ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Edit Category
            </DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-foreground font-semibold">Category Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Ground Chakkars"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-border focus:border-primary"
              />
            </div>

            {/* Icon Upload */}
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Category Icon (Optional)</Label>
              <div className="flex items-center gap-4">
                {iconPreview ? (
                  <div className="relative">
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-20 h-20 rounded-lg object-cover border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => {
                        clearIconSelection();
                        setFormData({ ...formData, icon: "" });
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {iconPreview ? "Change Icon" : "Upload Icon"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Max 2MB, PNG/JPG/WebP</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color" className="text-foreground font-semibold">Color Class (Optional)</Label>
              <Input
                id="edit-color"
                placeholder="e.g., text-primary, text-secondary"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="border-border focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-border hover:bg-muted"
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={saving || uploading}
            >
              {saving || uploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              {selectedCategory?.productCount && selectedCategory.productCount > 0 && (
                <span className="block mt-2 text-destructive font-semibold">
                  Warning: This category has {selectedCategory.productCount} products associated with it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-muted" disabled={saving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive hover:bg-destructive/90"
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
