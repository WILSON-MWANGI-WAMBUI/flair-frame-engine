import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, CreditCard, Truck, ShoppingBag, Lock } from "lucide-react";

interface ShippingInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface PaymentInfo {
  card_number: string;
  expiry: string;
  cvv: string;
  cardholder_name: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");

  const [shipping, setShipping] = useState<ShippingInfo>({
    full_name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    card_number: "",
    expiry: "",
    cvv: "",
    cardholder_name: "",
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to checkout</p>
          <Button onClick={() => navigate("/")} className="gradient-luxury text-luxury-foreground">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to complete your purchase</p>
          <Button onClick={() => navigate("/auth")} className="gradient-luxury text-luxury-foreground">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateShipping = () => {
    if (!shipping.full_name || !shipping.address || !shipping.city || !shipping.zip_code) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    const cardNumber = payment.card_number.replace(/\s/g, "");
    if (cardNumber.length < 13) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!payment.expiry || payment.expiry.length < 5) {
      toast.error("Please enter a valid expiry date");
      return false;
    }
    if (!payment.cvv || payment.cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    if (!payment.cardholder_name) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePayment()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          items: items.map((item) => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image,
          })),
          shipping,
          payment,
          total_cents: Math.round(totalPrice * 100),
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${data.order_id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              step === "shipping" ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setStep("shipping")}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "shipping" ? "gradient-luxury text-luxury-foreground" : "bg-muted"
              }`}
            >
              <Truck className="h-4 w-4" />
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div
            className={`flex items-center gap-2 ${
              step === "payment" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "payment" ? "gradient-luxury text-luxury-foreground" : "bg-muted"
              }`}
            >
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <Card className="p-6">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </h2>

              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={shipping.full_name}
                      onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      value={shipping.zip_code}
                      onChange={(e) => setShipping({ ...shipping, zip_code: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    placeholder="United States"
                  />
                </div>
              </div>

              <Button
                className="w-full mt-6 gradient-luxury text-luxury-foreground"
                onClick={() => {
                  if (validateShipping()) setStep("payment");
                }}
              >
                Continue to Payment
              </Button>
            </Card>
          )}

          {step === "payment" && (
            <Card className="p-6">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </h2>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholder_name">Cardholder Name</Label>
                  <Input
                    id="cardholder_name"
                    value={payment.cardholder_name}
                    onChange={(e) => setPayment({ ...payment, cardholder_name: e.target.value })}
                    placeholder="JOHN DOE"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card_number">Card Number</Label>
                  <Input
                    id="card_number"
                    value={payment.card_number}
                    onChange={(e) =>
                      setPayment({ ...payment, card_number: formatCardNumber(e.target.value) })
                    }
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button
                  className="flex-1 gradient-luxury text-luxury-foreground"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay ${totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Your payment information is secure and encrypted
              </p>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-20">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} / {item.color} × {item.quantity}
                    </p>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
