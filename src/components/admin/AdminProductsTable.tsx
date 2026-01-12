import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  stock: number;
  reserved: number;
  category: string | null;
  gender: string | null;
  featured: boolean | null;
  colors: string[] | null;
  sizes: string[] | null;
  currency: string | null;
}

const AdminProductsTable = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    description: "",
    price_cents: 0,
    stock: 0,
    category: "",
    gender: "",
    colors: "",
    sizes: "",
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (product: typeof newProduct) => {
      const { error } = await supabase.from("products").insert({
        title: product.title,
        slug: product.slug || product.title.toLowerCase().replace(/\s+/g, "-"),
        description: product.description,
        price_cents: product.price_cents,
        stock: product.stock,
        category: product.category || null,
        gender: product.gender || null,
        colors: product.colors ? product.colors.split(",").map((c) => c.trim()) : [],
        sizes: product.sizes ? product.sizes.split(",").map((s) => s.trim()) : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setIsCreateDialogOpen(false);
      setNewProduct({
        title: "",
        slug: "",
        description: "",
        price_cents: 0,
        stock: 0,
        category: "",
        gender: "",
        colors: "",
        sizes: "",
      });
      toast({ title: "Product created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from("products")
        .update({
          title: product.title,
          description: product.description,
          price_cents: product.price_cents,
          stock: product.stock,
          category: product.category,
          gender: product.gender,
          featured: product.featured,
        })
        .eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products ({products?.length || 0})</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  placeholder="auto-generated from title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (cents)</Label>
                  <Input
                    type="number"
                    value={newProduct.price_cents}
                    onChange={(e) => setNewProduct({ ...newProduct, price_cents: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Colors (comma-separated)</Label>
                <Input
                  value={newProduct.colors}
                  onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                  placeholder="Red, Blue, Black"
                />
              </div>
              <div>
                <Label>Sizes (comma-separated)</Label>
                <Input
                  value={newProduct.sizes}
                  onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => createMutation.mutate(newProduct)}
                disabled={createMutation.isPending || !newProduct.title}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category || "Uncategorized"}</Badge>
                </TableCell>
                <TableCell>
                  {((product.price_cents || 0) / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: product.currency || "USD",
                  })}
                </TableCell>
                <TableCell>
                  <span className={product.stock <= 5 ? "text-destructive font-medium" : ""}>
                    {product.stock}
                  </span>
                  {product.reserved > 0 && (
                    <span className="text-muted-foreground text-xs ml-1">
                      ({product.reserved} reserved)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {product.featured ? (
                    <Badge className="bg-accent">Featured</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editingProduct && (
                          <div className="space-y-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={editingProduct.title}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, title: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={editingProduct.description || ""}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, description: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Price (cents)</Label>
                                <Input
                                  type="number"
                                  value={editingProduct.price_cents}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price_cents: parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => editingProduct && updateMutation.mutate(editingProduct)}
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProductsTable;
