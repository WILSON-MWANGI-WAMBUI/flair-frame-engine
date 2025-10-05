import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product6 from "@/assets/product-6.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  gender: "men" | "women" | "unisex";
  sizes: string[];
  colors: string[];
  description: string;
  featured?: boolean;
}

export const products: Product[] = [
  // Women's Clothing
  {
    id: "1",
    name: "Elegant Silk Blouse",
    price: 89.99,
    image: product1,
    images: [product1, product1, product1],
    category: "Clothing",
    gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    description: "Luxurious silk blouse perfect for any occasion. Features a relaxed fit and elegant drape.",
    featured: true
  },
  {
    id: "2",
    name: "High-Waist Trousers",
    price: 79.99,
    image: product2,
    images: [product2, product2],
    category: "Clothing",
    gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Beige"],
    description: "Tailored high-waist trousers with a modern silhouette.",
    featured: true
  },
  // Women's Shoes
  {
    id: "3",
    name: "Leather Ankle Boots",
    price: 149.99,
    image: product3,
    images: [product3, product3],
    category: "Shoes",
    gender: "women",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Black", "Brown", "Tan"],
    description: "Premium leather ankle boots with comfortable heel.",
    featured: true
  },
  {
    id: "4",
    name: "Classic Pumps",
    price: 119.99,
    image: product3,
    images: [product3],
    category: "Shoes",
    gender: "women",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Black", "Nude", "Red"],
    description: "Timeless pumps for elegant occasions.",
  },
  // Women's Slippers
  {
    id: "5",
    name: "Luxury Velvet Slippers",
    price: 59.99,
    image: product1,
    images: [product1],
    category: "Slippers",
    gender: "women",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Rose", "Grey", "Navy"],
    description: "Plush velvet slippers with memory foam insole.",
  },
  // Men's Clothing
  {
    id: "6",
    name: "Tailored Wool Suit",
    price: 399.99,
    image: product6,
    images: [product6, product6],
    category: "Clothing",
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Navy", "Black"],
    description: "Impeccably tailored wool suit for the modern gentleman.",
    featured: true
  },
  {
    id: "7",
    name: "Oxford Shirt",
    price: 69.99,
    image: product6,
    images: [product6],
    category: "Clothing",
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Pink"],
    description: "Classic Oxford shirt in premium cotton.",
  },
  // Men's Shoes
  {
    id: "8",
    name: "Leather Derby Shoes",
    price: 159.99,
    image: product8,
    images: [product8],
    category: "Shoes",
    gender: "men",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Black", "Brown"],
    description: "Handcrafted leather derby shoes.",
    featured: true
  },
  {
    id: "9",
    name: "Casual Sneakers",
    price: 99.99,
    image: product8,
    images: [product8],
    category: "Shoes",
    gender: "men",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["White", "Black", "Navy"],
    description: "Premium leather sneakers for everyday wear.",
  },
  // Men's Slippers
  {
    id: "10",
    name: "Premium Suede Slippers",
    price: 69.99,
    image: product8,
    images: [product8],
    category: "Slippers",
    gender: "men",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Brown", "Grey", "Black"],
    description: "Luxurious suede slippers with sheepskin lining.",
  },
  // Accessories
  {
    id: "11",
    name: "Leather Handbag",
    price: 129.99,
    image: product1,
    images: [product1],
    category: "Accessories",
    gender: "unisex",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    description: "Genuine leather handbag with adjustable strap and multiple compartments.",
    featured: true
  },
  {
    id: "12",
    name: "Designer Sunglasses",
    price: 79.99,
    image: product2,
    images: [product2],
    category: "Accessories",
    gender: "unisex",
    sizes: ["One Size"],
    colors: ["Black", "Tortoise", "Gold"],
    description: "Premium designer sunglasses with UV protection.",
  },
  {
    id: "13",
    name: "Leather Belt",
    price: 49.99,
    image: product3,
    images: [product3],
    category: "Accessories",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    description: "Classic leather belt with brass buckle.",
  },
  {
    id: "14",
    name: "Silk Scarf",
    price: 39.99,
    image: product6,
    images: [product6],
    category: "Accessories",
    gender: "unisex",
    sizes: ["One Size"],
    colors: ["Floral", "Geometric", "Solid"],
    description: "Luxurious silk scarf perfect for any occasion.",
  },
  {
    id: "15",
    name: "Statement Necklace",
    price: 34.99,
    image: product1,
    images: [product1],
    category: "Accessories",
    gender: "unisex",
    sizes: ["One Size"],
    colors: ["Gold", "Silver", "Rose Gold"],
    description: "Bold statement necklace to elevate any outfit.",
  },
  {
    id: "16",
    name: "Vintage Watch",
    price: 149.99,
    image: product8,
    images: [product8],
    category: "Accessories",
    gender: "unisex",
    sizes: ["Adjustable"],
    colors: ["Silver", "Gold", "Black"],
    description: "Classic vintage-style watch with leather strap.",
  },
];
