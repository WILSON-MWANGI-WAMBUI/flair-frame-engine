import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryClothing from "@/assets/category-clothing.jpg";
import categoryShoes from "@/assets/category-shoes.jpg";
import categorySlippers from "@/assets/category-slippers.jpg";

const Home = () => {
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Luxury fashion boutique" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in text-balance text-white">
            Elevate Your Style
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in text-balance">
            Discover premium fashion and footwear curated for those who appreciate quality and elegance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
            <Link to="/women">
              <Button size="lg" className="gradient-luxury text-luxury-foreground hover:shadow-luxury transition-smooth">
                Shop Women
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/men">
              <Button size="lg" variant="outline" className="hover-scale bg-white/10 text-white border-white/30 hover:bg-white/20">
                Shop Men
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/women?category=clothing" className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-card hover-lift">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={categoryClothing}
                alt="Clothing"
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Clothing</h3>
                <p className="text-sm opacity-90">Discover the latest trends</p>
              </div>
            </div>
          </Link>
          
          <Link to="/women?category=shoes" className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-card hover-lift">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={categoryShoes}
                alt="Shoes"
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Shoes</h3>
                <p className="text-sm opacity-90">Step into style</p>
              </div>
            </div>
          </Link>
          
          <Link to="/women?category=slippers" className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-card hover-lift">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={categorySlippers}
                alt="Slippers"
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Slippers</h3>
                <p className="text-sm opacity-90">Comfort meets luxury</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Featured Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
