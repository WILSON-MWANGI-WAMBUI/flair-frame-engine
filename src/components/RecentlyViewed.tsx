import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RecentlyViewedProps {
  excludeProductId?: string;
}

const RecentlyViewed = ({ excludeProductId }: RecentlyViewedProps) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  const filteredProducts = excludeProductId
    ? recentlyViewed.filter((p) => p.id !== excludeProductId)
    : recentlyViewed;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Recently Viewed
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
