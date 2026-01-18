import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "SHIPPED":
        return <Badge className="bg-blue-600">Shipped</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-600">Delivered</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary">Expired</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/">
            <Button className="gradient-luxury text-luxury-foreground">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-mono text-sm font-medium">
                    Order #{order.id.substring(0, 8).toUpperCase()}
                  </h2>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${(order.total_cents / 100).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                </p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {order.items.slice(0, 4).map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    +{order.items.length - 4} more
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Link to={`/order-confirmation/${order.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
