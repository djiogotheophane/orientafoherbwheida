export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  image: string; // Path to original image like '/assets/...'
  fallbackImage?: string; // High-quality Unsplash image as a beautiful fallback
  price?: number; // Optional price for realistic catalog feel
  benefits?: string[]; // Detailed list of benefits for the modal view
  howToUse?: string; // How to use instructions
  ingredients?: string[]; // Ingredients
  sellerName?: string; // Name of the seller
  sellerSlug?: string; // Slugified seller name
  productSlug?: string; // Slugified product name
}

export type Category = 
  | "Compléments alimentaires" 
  | "Produits de bien-être" 
  | "Hygiène et soins" 
  | "Boissons fonctionnelles" 
  | "Appareils de santé";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Boutique {
  id: string;
  email: string;
  sellerName: string;
  sellerSlug: string;
  shopName: string;
  createdAt: string;
}
