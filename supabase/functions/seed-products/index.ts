import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if products already exist
    const { data: existing } = await supabase.from('products').select('id').limit(1);
    
    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Products already seeded' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert products
    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Products seeded successfully', count: data.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
