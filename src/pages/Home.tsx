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
            Sustainable Style, Timeless Quality
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in text-balance">
            Discover curated thrifted fashion and footwear. Quality pieces that tell a story, priced to make sustainable fashion accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
            <Link to="/women">
              <Button size="lg" className="gradient-luxury text-luxury-foreground hover:shadow-luxury transition-smooth">
                Shop Clothing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/men">
              <Button size="lg" variant="outline" className="hover-scale bg-white/10 text-white border-white/30 hover:bg-white/20">
                Shop Footwear
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

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Why Thrift With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full gradient-luxury flex items-center justify-center">
              <svg className="w-8 h-8 text-luxury-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Eco-Friendly</h3>
            <p className="text-muted-foreground">Reduce fashion waste and contribute to a sustainable future with every purchase.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full gradient-luxury flex items-center justify-center">
              <svg className="w-8 h-8 text-luxury-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Quality Curated</h3>
            <p className="text-muted-foreground">Every piece is carefully inspected and selected for quality, style, and condition.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full gradient-luxury flex items-center justify-center">
              <svg className="w-8 h-8 text-luxury-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Affordable Luxury</h3>
            <p className="text-muted-foreground">Premium brands and styles at thrift store prices. Style doesn't have to break the bank.</p>
          </div>
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

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl gradient-dark p-12 md:p-16 text-center text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-luxury" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Join the Sustainable Fashion Movement</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Every purchase makes a difference. Shop quality pre-loved fashion and help reduce textile waste.
            </p>
            <Link to="/women">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-smooth">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
