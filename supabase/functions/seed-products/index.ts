import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const products = [
  {
    title: "Classic Leather Jacket",
    slug: "classic-leather-jacket",
    description: "Timeless leather jacket perfect for any occasion",
    price_cents: 29999,
    stock: 15,
    images: ["/placeholder.svg"],
    category: "clothing",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    featured: true,
  },
  {
    title: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    description: "Authentic vintage denim with perfect fade",
    price_cents: 18999,
    stock: 20,
    images: ["/placeholder.svg"],
    category: "clothing",
    gender: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Light Blue"],
    featured: true,
  },
  {
    title: "Designer High Heels",
    slug: "designer-high-heels",
    description: "Elegant heels for special occasions",
    price_cents: 24999,
    stock: 12,
    images: ["/placeholder.svg"],
    category: "shoes",
    gender: "Women",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Black", "Red", "Nude"],
    featured: false,
  },
  {
    title: "Cozy House Slippers",
    slug: "cozy-house-slippers",
    description: "Ultra-comfortable slippers for home",
    price_cents: 4999,
    stock: 30,
    images: ["/placeholder.svg"],
    category: "slippers",
    gender: "Women",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Pink", "Gray", "Cream"],
    featured: false,
  },
  {
    title: "Men's Casual Shirt",
    slug: "mens-casual-shirt",
    description: "Comfortable casual shirt for everyday wear",
    price_cents: 8999,
    stock: 25,
    images: ["/placeholder.svg"],
    category: "clothing",
    gender: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Gray"],
    featured: true,
  },
  {
    title: "Leather Handbag",
    slug: "leather-handbag",
    description: "Elegant leather handbag for daily use",
    price_cents: 15999,
    stock: 18,
    images: ["/placeholder.svg"],
    category: "accessories",
    gender: "Women",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
  },
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to check their role
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Check if the user has admin role using the has_role function
    const { data: isAdmin, error: roleError } = await userClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Failed to check admin role:', roleError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      console.error('User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin access verified for user:', user.id);

    // Use service role client for database operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if products already exist
    const { data: existing } = await supabase.from('products').select('id').limit(1);
    
    if (existing && existing.length > 0) {
      console.log('Products already seeded');
      return new Response(
        JSON.stringify({ message: 'Products already seeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert products
    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
      console.error('Failed to insert products:', error.message);
      throw error;
    }

    console.log('Products seeded successfully:', data.length);

    return new Response(
      JSON.stringify({ message: 'Products seeded successfully', count: data.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in seed-products function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
