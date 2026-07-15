import React, { useState } from 'react';
import { Product } from '../types';
import { Eye, ShoppingCart, Leaf, Award, Heart, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onOrder: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onViewDetails, onOrder, onDelete }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get specific icon based on category
  const getCategoryIcon = () => {
    switch (product.category) {
      case "Compléments alimentaires":
        return <Leaf className="w-3.5 h-3.5 text-taupe" />;
      case "Appareils de santé":
        return <Award className="w-3.5 h-3.5 text-taupe" />;
      case "Produits de bien-être":
        return <Heart className="w-3.5 h-3.5 text-taupe" />;
      default:
        return <Leaf className="w-3.5 h-3.5 text-taupe" />;
    }
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-accent/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col min-h-[450px] h-auto pb-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Area */}
      <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-b from-beige/30 to-beige/60 flex items-center justify-center p-4">
        {/* Subtle background color based on hover */}
        <div className="absolute inset-0 bg-accent/25 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
        
        {!product.image || imgError ? (
          <div className="flex flex-col items-center justify-center text-center p-4 z-10 select-none">
            <span className="text-[10px] uppercase tracking-widest text-taupe font-bold">Image non fournie</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-accent/40 py-1 px-2.5 rounded-full flex items-center gap-1.5 shadow-xs">
          {getCategoryIcon()}
          <span className="text-[9px] font-semibold tracking-wider text-taupe uppercase">
            {product.category}
          </span>
        </div>

        {/* Like Button */}
        <button 
          id={`like-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-xs transition-all duration-300 ${
            isLiked 
              ? 'bg-rose-50 text-rose-500 scale-110' 
              : 'bg-white/95 backdrop-blur-md text-stone-400 hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {onDelete && (
          <button 
            id={`delete-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit de votre site ?")) {
                onDelete(product.id);
              }
            }}
            className="absolute top-14 right-3 p-2 rounded-full bg-white/95 backdrop-blur-md text-stone-400 hover:text-rose-600 hover:scale-110 transition-all duration-300 shadow-xs z-10"
            title="Supprimer ce produit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            id={`quick-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="bg-white text-ink border border-accent/60 font-medium text-xs px-4 py-2.5 rounded-lg shadow-md hover:bg-ink hover:text-white transition-all duration-200 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            Voir les détails
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="flex-grow flex flex-col justify-start">
          <span className="text-[9px] font-bold tracking-widest text-taupe uppercase mb-1 block">
            {product.category}
          </span>
          <h3 className="text-base font-display font-semibold text-ink leading-snug line-clamp-2 h-[44px] group-hover:text-taupe transition-colors duration-200">
            {product.name}
          </h3>
          
          {product.sellerName && (
            <span className="text-[10px] text-taupe font-medium block mt-1.5 mb-1">
              Conseiller : <span className="font-semibold">{product.sellerName}</span>
            </span>
          )}
          
          <p className="text-[#666] text-[11px] leading-relaxed mb-4 line-clamp-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Tag if provided */}
          {product.price && (
            <div className="mb-4">
              <span className="text-xs text-taupe/80 font-semibold uppercase tracking-wider">Prix conseillé: </span>
              <span className="text-sm font-bold text-ink">{product.price.toLocaleString('fr-FR')} FCFA</span>
            </div>
          )}

          {/* Actions Row */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button
              id={`card-details-btn-${product.id}`}
              onClick={() => onViewDetails(product)}
              className="w-full text-center border border-taupe text-taupe font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-md transition-colors duration-200 hover:bg-beige cursor-pointer"
            >
              Détails
            </button>
            
            <a
              id={`card-order-btn-${product.id}`}
              href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                `Bonjour, je souhaite obtenir plus d'informations et commander le produit : ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-ink hover:bg-taupe text-white font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-md transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Commander
            </a>
          </div>

          {onDelete && (
            <button
              id={`card-delete-action-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit de votre site ?")) {
                  onDelete(product.id);
                }
              }}
              className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
