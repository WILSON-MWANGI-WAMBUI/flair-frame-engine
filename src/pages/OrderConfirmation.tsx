import { useParams, Link } from "react-router-dom";
import { useOrder } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Loader2 } from "lucide-react";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, loading } = useOrder(orderId || "");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order. Please check your order ID.
          </p>
          <Link to="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Order ID: <span className="font-mono font-medium">{order.id.substring(0, 8).toUpperCase()}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
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

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.total_cents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(order.total_cents / 100).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            {order.shipping_info && (
              <Card className="p-6">
                <h2 className="font-display text-lg font-bold mb-4">Shipping Address</h2>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_info.full_name}</p>
                  <p className="text-muted-foreground">{order.shipping_info.address}</p>
                  <p className="text-muted-foreground">
                    {order.shipping_info.city}, {order.shipping_info.state} {order.shipping_info.zip_code}
                  </p>
                  <p className="text-muted-foreground">{order.shipping_info.country}</p>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="font-display text-lg font-bold mb-4">Order Information</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">{order.status}</span>
                </div>
                {order.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-mono">{order.payment_method}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/orders">
            <Button variant="outline" size="lg">
              View All Orders
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" className="gradient-luxury text-luxury-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
