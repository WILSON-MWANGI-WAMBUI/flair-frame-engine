import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = ["all", "clothing", "shoes", "slippers", "accessories"];
const GENDERS = ["all", "women", "men", "unisex"];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [gender, setGender] = useState(searchParams.get("gender") || "all");
  
  // Get min/max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, []);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || minPrice,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ]);

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter(p => p.category.toLowerCase() === category);
    }

    // Filter by gender
    if (gender !== "all") {
      result = result.filter(p => p.gender === gender || p.gender === "unisex");
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // relevance - featured first, then by name
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    return result;
  }, [searchQuery, category, gender, priceRange, sortBy]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "relevance") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateSearchParams({ q: value });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateSearchParams({ category: value });
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    updateSearchParams({ gender: value });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    updateSearchParams({ 
      minPrice: newRange[0].toString(), 
      maxPrice: newRange[1].toString() 
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateSearchParams({ sort: value });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setGender("all");
    setPriceRange([minPrice, maxPrice]);
    setSortBy("relevance");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = 
    searchQuery || 
    category !== "all" || 
    gender !== "all" || 
    priceRange[0] !== minPrice || 
    priceRange[1] !== maxPrice ||
    sortBy !== "relevance";

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Gender</Label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Button
              key={g}
              variant={gender === g ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenderChange(g)}
              className="capitalize"
            >
              {g}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={minPrice}
            max={maxPrice}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
            Search Products
          </h1>
          
          {/* Search Input */}
          <div className="max-w-2xl mx-auto relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg rounded-full border-2 focus-visible:ring-accent"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => handleSearch("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <Card className="p-6 sticky top-20">
              <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h2>
              <FilterContent />
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> products found
              </p>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch("")}
                    className="gap-1"
                  >
                    Search: "{searchQuery}"
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {category !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCategoryChange("all")}
                    className="gap-1 capitalize"
                  >
                    {category}
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {gender !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGenderChange("all")}
                    className="gap-1 capitalize"
                  >
                    {gender}
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePriceChange([minPrice, maxPrice])}
                    className="gap-1"
                  >
                    ${priceRange[0]} - ${priceRange[1]}
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-display text-xl font-bold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
