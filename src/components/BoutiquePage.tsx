import React, { useState } from 'react';
import { Product, Boutique } from '../types';
import ProductCard from './ProductCard';
import { ArrowLeft, Copy, Check, Store, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface BoutiquePageProps {
  sellerProducts: Product[];
  sellerSlug: string;
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  currentSpace: 'client' | 'admin';
  boutiques?: Boutique[];
}

export default function BoutiquePage({
  sellerProducts,
  sellerSlug,
  onNavigate,
  onAddToCart,
  onViewDetails,
  onDeleteProduct,
  currentSpace,
  boutiques = [],
}: BoutiquePageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyShopLink = () => {
    const origin = window.location.origin;
    // support either clean urls or hash fallbacks for maximum compatibility
    const link = `${origin}/#/boutique/${sellerSlug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find boutique details if saved
  const matchedBoutique = boutiques.find(b => b.sellerSlug === sellerSlug);

  // Extract seller name from first product or use matching boutique name/formatted slug
  const rawSellerName = sellerProducts.length > 0 
    ? sellerProducts[0].sellerName 
    : matchedBoutique 
      ? matchedBoutique.sellerName 
      : sellerSlug.charAt(0).toUpperCase() + sellerSlug.slice(1).replace(/-/g, ' ');

  const sellerName = rawSellerName || 'Conseiller Orienta';
  const shopName = matchedBoutique?.shopName || `Boutique de ${sellerName}`;

  return (
    <div className="bg-beige/20 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-taupe hover:text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site général
          </button>
          
          <button
            onClick={handleCopyShopLink}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white hover:bg-beige text-taupe py-2 px-4 rounded-xl border border-accent/40 shadow-2xs transition-all cursor-pointer"
            title="Copier le lien permanent de cette boutique"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Lien de la Boutique Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Partager cette Boutique</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Boutique Hero Header banner */}
        <div className="bg-white rounded-3xl border border-accent/40 shadow-xs p-6 sm:p-10 mb-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Store className="w-40 h-40 text-taupe" />
          </div>
          
          <div className="space-y-3 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#656d4a]/10 text-[#656d4a] py-1 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Client Privé
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold italic text-ink tracking-tight">
              {shopName}
            </h1>
            <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
              Découvrez la sélection exclusive de compléments de santé et d'appareils de bien-être FOHOW de votre conseiller attitré. Profitez de conseils d'orientation sur mesure et commandez en toute confiance.
            </p>
          </div>
          
          <div className="bg-beige/40 border border-accent/30 rounded-2xl p-4 sm:p-5 text-left min-w-[200px] z-10 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-taupe block mb-1">Votre Conseiller</span>
            <span className="font-display font-semibold text-ink text-base block mb-3">{sellerName}</span>
            <a
              href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                `Bonjour ${sellerName}, je navigue actuellement sur votre boutique Fohow et j'aimerais obtenir des conseils personnalisés.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-[#25D366] hover:bg-[#22c35e] text-white text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-lg shadow-2xs transition-all text-center cursor-pointer"
            >
              Écrire sur WhatsApp
            </a>
          </div>
        </div>

        {/* Dynamic seller products grid */}
        {sellerProducts.length === 0 ? (
          <div className="bg-white border border-accent/30 rounded-2xl p-12 text-center max-w-xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-beige/60 flex items-center justify-center text-taupe mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-lg text-ink mb-1">Boutique vide</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Ce conseiller n'a pas encore ajouté de fiches produits Fohow personnalisées sur sa boutique.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-semibold py-2.5 px-6 rounded-md transition-all cursor-pointer"
            >
              Voir le catalogue général
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b border-accent/30 pb-4 mb-8 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-taupe flex items-center gap-2">
                <Store className="w-4 h-4 text-taupe" /> Produits de ce Conseiller ({sellerProducts.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {sellerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewDetails}
                  onOrder={onAddToCart}
                  onDelete={currentSpace === 'admin' ? onDeleteProduct : undefined}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
