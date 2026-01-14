import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's auth token
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing order for user:", user.id);

    const { items, shipping, payment, total_cents } = await req.json() as {
      items: CartItem[];
      shipping: ShippingInfo;
      payment: PaymentInfo;
      total_cents: number;
    };

    // Validate input
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!shipping || !shipping.full_name || !shipping.address) {
      return new Response(
        JSON.stringify({ error: "Shipping information is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify stock availability and calculate total
    let calculatedTotal = 0;
    const verifiedItems: CartItem[] = [];

    for (const item of items) {
      const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("id, title, price_cents, stock, reserved")
        .eq("id", item.product_id)
        .single();

      if (productError || !product) {
        console.error("Product not found:", item.product_id);
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const availableStock = product.stock - product.reserved;
      if (availableStock < item.quantity) {
        return new Response(
          JSON.stringify({ 
            error: `Insufficient stock for ${product.title}. Available: ${availableStock}` 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      calculatedTotal += product.price_cents * item.quantity;
      verifiedItems.push({
        ...item,
        price: product.price_cents / 100,
      });
    }

    // Simulate payment processing (in real app, integrate with payment gateway)
    console.log("Processing payment...");
    
    // Basic card validation (mock)
    const cardNumber = payment.card_number.replace(/\s/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return new Response(
        JSON.stringify({ error: "Invalid card number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simulate payment success (90% success rate for demo)
    const paymentSuccess = Math.random() > 0.1;
    if (!paymentSuccess) {
      return new Response(
        JSON.stringify({ error: "Payment declined. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Payment successful!");

    // Reserve stock for the order
    for (const item of verifiedItems) {
      // Get current reserved value and increment
      const { data: productData } = await supabaseAdmin
        .from("products")
        .select("reserved")
        .eq("id", item.product_id)
        .single();

      if (productData) {
        await supabaseAdmin
          .from("products")
          .update({ reserved: (productData.reserved || 0) + item.quantity })
          .eq("id", item.product_id);
      }
    }

    // Create the order
    const orderData = {
      user_id: user.id,
      items: verifiedItems.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        image: item.image,
      })),
      total_cents: calculatedTotal,
      status: "COMPLETED",
      shipping_info: shipping,
      payment_method: `**** **** **** ${cardNumber.slice(-4)}`,
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Order created successfully:", order.id);

    // Deduct from stock (mark as sold)
    for (const item of verifiedItems) {
      await supabaseAdmin
        .from("products")
        .select("stock, reserved")
        .eq("id", item.product_id)
        .single()
        .then(({ data }) => {
          if (data) {
            return supabaseAdmin
              .from("products")
              .update({
                stock: data.stock - item.quantity,
                reserved: Math.max(0, data.reserved - item.quantity),
              })
              .eq("id", item.product_id);
          }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        message: "Order placed successfully!",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
