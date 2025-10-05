import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const CategoryPage = () => {
  const { gender } = useParams<{ gender?: "men" | "women" | "all" }>();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "all");

  const filteredProducts = products.filter((product) => {
    const matchesGender = !gender || gender === "all" || product.gender === gender || product.gender === "unisex";
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    return matchesGender && matchesCategory;
  });

  const categories = ["all", "clothing", "shoes", "slippers", "accessories"];
  
  const pageTitle = gender && gender !== "all" 
    ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`
    : "All Products";

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-luxury/20" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center">
            {pageTitle}
          </h1>
          <p className="text-center text-muted-foreground mt-4">
            Discover our curated selection of sustainable thrifted fashion
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
          
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredProducts.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
