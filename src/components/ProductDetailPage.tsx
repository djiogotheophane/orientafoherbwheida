import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Copy, Check, Leaf, Award, Heart, Store } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailPage({ product, onNavigate, onAddToCart }: ProductDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleCopyLink = () => {
    const origin = window.location.origin;
    // support both clean pathname and hash fallback
    const link = `${origin}/produit/${product.productSlug || product.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = () => {
    switch (product.category) {
      case "Compléments alimentaires":
        return <Leaf className="w-4 h-4 text-taupe" />;
      case "Appareils de santé":
        return <Award className="w-4 h-4 text-taupe" />;
      case "Produits de bien-être":
        return <Heart className="w-4 h-4 text-taupe" />;
      default:
        return <Leaf className="w-4 h-4 text-taupe" />;
    }
  };

  return (
    <div className="bg-beige/20 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Return button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-taupe hover:text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Catalogue
          </button>
          
          <span className="text-[10px] text-stone-400 font-mono">
            ID: {product.id}
          </span>
        </div>

        {/* Product Showcase */}
        <div className="bg-white rounded-3xl border border-accent/40 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
          
          {/* Left Column: Image Area */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-beige/20 to-beige/50 rounded-2xl p-6 border border-accent/20 h-[350px] sm:h-[450px] relative overflow-hidden">
            {!product.image || imgError ? (
              <span className="text-[10px] uppercase tracking-widest text-taupe font-bold">Image non fournie</span>
            ) : (
              <motion.img
                src={product.image}
                alt={product.name}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
            
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-accent/40 py-1.5 px-3 rounded-full flex items-center gap-2 shadow-xs">
              {getCategoryIcon()}
              <span className="text-[10px] font-bold tracking-wider text-taupe uppercase">
                {product.category}
              </span>
            </div>
          </div>

          {/* Right Column: Content & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Product Category & Share Link */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-taupe uppercase">
                  {product.category}
                </span>
                
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-beige hover:bg-beige-dark/20 text-taupe py-1.5 px-3 rounded-lg border border-accent/30 transition-all cursor-pointer"
                  title="Copier le lien permanent de ce produit"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Lien Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le Lien</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold italic text-ink tracking-tight mb-6">
                {product.name}
              </h1>

              {/* Price Row */}
              {product.price && (
                <div className="bg-beige/30 border border-accent/20 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <span className="text-xs text-taupe font-bold uppercase tracking-wider">Prix conseillé</span>
                  <span className="text-2xl font-bold text-ink">{product.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[#444] leading-relaxed mb-6">
                <p>{product.description}</p>
              </div>

              {/* Benefits (Bienfaits) if available */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-taupe mb-2.5">
                    Bienfaits & Avantages
                  </h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#555]">
                        <span className="text-[#656d4a] mt-0.5">✔</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients & Usage panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-taupe mb-1.5">
                      Composition / Ingrédients
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {product.ingredients.join(', ')}
                    </p>
                  </div>
                )}
                {product.howToUse && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-taupe mb-1.5">
                      Conseils d'utilisation
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {product.howToUse}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions panel */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-stone-200 rounded-lg bg-stone-50 p-1.5 sm:w-32 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-ink font-bold text-sm disabled:opacity-30 cursor-pointer"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="font-bold text-sm text-ink text-center w-8 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-ink font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  alert(`${quantity} x "${product.name}" ajouté au panier avec succès !`);
                }}
                className="flex-grow bg-white hover:bg-beige border border-taupe text-taupe font-bold text-[11px] uppercase tracking-widest py-3.5 px-6 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter au Panier
              </button>

              {/* WhatsApp direct Order link */}
              <a
                href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                  `Bonjour, je souhaite commander ${quantity} x le produit "${product.name}". Pouvez-vous me guider ?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow text-center bg-ink hover:bg-taupe text-white font-bold text-[11px] uppercase tracking-widest py-3.5 px-6 rounded-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                Acheter Maintenant
              </a>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
