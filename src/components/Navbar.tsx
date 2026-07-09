import React from 'react';
import { ShoppingCart, Search, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const LOGO_IMG = new URL('../assets/images/fohowhope_logo_1783630501861.jpg', import.meta.url).href;

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-gray-light/90 backdrop-blur-md border-b border-stone-200" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img 
              src={LOGO_IMG} 
              alt="Fohowhope Logo" 
              className="w-12 h-12 object-contain rounded-full border border-stone-200" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-semibold italic text-ink tracking-wide leading-none">
                Orienta
              </span>
              <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase leading-none mt-1">
                Foherb Whieda
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-grow max-w-md relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="desktop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un produit (ex: Peptide, Spiruline, Café...)"
              className="w-full text-xs py-2.5 pl-10 pr-4 bg-white border border-accent/60 rounded-xl focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all text-ink"
            />
          </div>

          {/* Quick links & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-accent/60 bg-white text-ink hover:bg-beige transition-all flex items-center justify-center group"
            >
              <ShoppingCart className="w-5 h-5 text-ink group-hover:text-taupe transition-colors" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-taupe text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Category Quick Bar */}
        <div className="py-2.5 md:hidden border-t border-stone-200/60 flex flex-col gap-2">
          {/* Search input for mobile */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              id="mobile-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un produit FOHOW..."
              className="w-full text-xs py-2 pl-9 pr-4 bg-white border border-accent/60 rounded-lg focus:outline-none focus:border-taupe text-ink"
            />
          </div>
        </div>

      </div>
    </nav>
  );
}
