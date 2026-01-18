import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import RecentlyViewed from "@/components/RecentlyViewed";
import { ShoppingBag } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Choose a size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.image,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === idx ? "border-accent" : "border-transparent"
                }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className="min-w-[3rem]"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full gradient-luxury text-luxury-foreground hover:shadow-luxury transition-smooth"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          {/* Product Info */}
          <div className="border-t pt-6 space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium capitalize">{product.category}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="font-medium capitalize">{product.gender}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <RecentlyViewed excludeProductId={id} />
    </div>
  );
};

export default ProductDetail;
