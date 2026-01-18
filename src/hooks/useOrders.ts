import { useState, useEffect } from "react";

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total_cents: number;
  status: string;
  created_at: string;
  shipping_info?: {
    full_name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method?: string;
}

const ORDERS_KEY = "icon_thrift_orders";

export const getOrders = (): Order[] => {
  const saved = localStorage.getItem(ORDERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrderById = (id: string): Order | null => {
  const orders = getOrders();
  return orders.find(o => o.id === id) || null;
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders(getOrders());
    setLoading(false);
  }, []);

  return { orders, loading };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrder(getOrderById(id));
    setLoading(false);
  }, [id]);

  return { order, loading };
};
