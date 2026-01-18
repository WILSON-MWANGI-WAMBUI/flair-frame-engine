import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            ICON THRIFT
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/all?category=clothing" className="text-sm font-medium hover:text-accent transition-colors">
              Clothing
            </Link>
            <Link to="/all?category=shoes" className="text-sm font-medium hover:text-accent transition-colors">
              Footwear
            </Link>
            <Link to="/all?category=accessories" className="text-sm font-medium hover:text-accent transition-colors">
              Accessories
            </Link>
            <Link to="/new" className="text-sm font-medium hover:text-accent transition-colors">
              New Arrivals
            </Link>
            <Link to="/sale" className="text-sm font-medium hover:text-accent transition-colors">
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => navigate("/search")}>
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate("/orders")} title="My Orders">
                  <Package className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} title="Sign in">
                <User className="h-5 w-5" />
              </Button>
            )}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t animate-fade-in">
            <Link
              to="/all?category=clothing"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clothing
            </Link>
            <Link
              to="/all?category=shoes"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Footwear
            </Link>
            <Link
              to="/all?category=accessories"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link
              to="/new"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              to="/sale"
              className="block text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sale
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
