import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Check, ShoppingCart, Info, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOrder: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onOrder }: ProductModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="product-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl flex flex-col md:flex-row border border-stone-100"
          >
            {/* Close button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-beige hover:bg-accent/40 text-taupe hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image Panel */}
            <div className="md:w-1/2 bg-gradient-to-b from-beige/40 to-beige/70 p-6 sm:p-8 flex flex-col justify-center items-center relative min-h-[300px] border-r border-accent/20">
              <div className="absolute inset-0 bg-accent/10" />
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
                  className="w-full max-h-[350px] object-contain relative z-10"
                />
              )}
              
              <div className="relative z-10 mt-6 bg-white/90 backdrop-blur-md border border-accent/40 px-4 py-2.5 rounded-xl w-full text-center">
                <span className="text-[10px] text-taupe uppercase tracking-widest font-semibold block mb-0.5">Catégorie</span>
                <span className="text-sm font-display font-bold text-ink">{product.category}</span>
              </div>
            </div>

            {/* Product Details Panel */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] md:max-h-none overflow-y-auto">
              <div>
                <span className="text-[10px] font-semibold text-taupe uppercase tracking-widest block mb-1">
                  Orienta Foherb Whieda
                </span>
                <h2 className="text-2xl font-display font-semibold italic text-ink tracking-tight mb-3">
                  {product.name}
                </h2>

                <p className="text-[#666] text-xs leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-taupe flex items-center gap-1.5 mb-3">
                      <Activity className="w-4 h-4 text-taupe" /> Bienfaits Clés
                    </h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#666] text-xs">
                          <Check className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ingredients & How to Use Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="bg-beige/40 p-3.5 rounded-xl border border-accent/30">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-taupe flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-taupe" /> Ingrédients
                      </h4>
                      <ul className="space-y-1">
                        {product.ingredients.map((ing, idx) => (
                          <li key={idx} className="text-[#666] text-[11px] list-disc list-inside">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.howToUse && (
                    <div className="bg-beige/40 p-3.5 rounded-xl border border-accent/30">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-taupe flex items-center gap-1.5 mb-2">
                        <Info className="w-3.5 h-3.5 text-taupe" /> Conseil d'utilisation
                      </h4>
                      <p className="text-[#666] text-[11px] leading-normal">
                        {product.howToUse}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-accent/20 mt-6 flex items-center justify-between gap-4">
                {product.price && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-taupe font-semibold uppercase tracking-wider">Prix conseillé</span>
                    <span className="text-xl font-display font-semibold text-ink">{product.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                
                <a
                  id="modal-order-btn"
                  href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                    `Bonjour, je souhaite obtenir plus d'informations et commander le produit : ${product.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow sm:flex-none bg-ink hover:bg-taupe text-white font-semibold text-[10px] uppercase tracking-wider py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow text-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Commander Maintenant
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
