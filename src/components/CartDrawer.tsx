import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { X, Trash2, Plus, Minus, CreditCard, Send, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    notes: '',
    paymentMethod: 'delivery_cash' // cash on delivery is very common for FOHOW/FOHERB
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + (item.product.price || 0) * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    // Simulate sending order to WhatsApp / Server / Email
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderCompleted(true);
      setInvoiceId('OFW-' + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  const handleReset = () => {
    onClearCart();
    setOrderCompleted(false);
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      email: '',
      notes: '',
      paymentMethod: 'delivery_cash'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        />

        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="pointer-events-auto w-screen max-w-md"
            >
              <div className="flex h-full flex-col bg-white shadow-2xl border-l border-accent/20">
                {/* Header */}
                <div className="px-5 py-5 border-b border-accent/40 flex items-center justify-between bg-gray-light">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-taupe" />
                    <h2 className="text-lg font-display font-semibold italic text-ink">Votre Commande</h2>
                    <span className="bg-taupe/15 text-taupe text-xs font-bold py-0.5 px-2.5 rounded-full">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  </div>
                  <button
                    id="close-cart-btn"
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-accent/30 text-taupe transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-5">
                  {orderCompleted ? (
                    /* Order Completed State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center p-4"
                    >
                      <CheckCircle2 className="w-16 h-16 text-taupe mb-4 animate-bounce" />
                      <h3 className="text-xl font-display font-semibold italic text-ink mb-2">Commande Validée !</h3>
                      <p className="text-[#666] text-xs mb-6 max-w-xs leading-relaxed">
                        Merci pour votre confiance, <strong>{formData.fullName}</strong>. Un conseiller d'Orienta Foherb Whieda va vous contacter sous peu par téléphone.
                      </p>
                      
                      {/* Invoice card */}
                      <div className="bg-beige border border-accent/60 rounded-xl p-4 w-full text-left mb-8 text-xs space-y-2.5">
                        <div className="flex justify-between border-b border-accent/40 pb-2">
                          <span className="font-semibold text-taupe">ID Facture:</span>
                          <span className="font-bold text-ink">{invoiceId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-taupe">Téléphone:</span>
                          <span className="font-semibold text-ink">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-taupe">Adresse de livraison:</span>
                          <span className="font-semibold text-ink text-right max-w-[200px] truncate">{formData.address}</span>
                        </div>
                        <div className="flex justify-between border-t border-accent/40 pt-2 font-bold text-sm">
                          <span className="text-ink">Total payé:</span>
                          <span className="text-taupe">{totalAmount > 0 ? `${totalAmount} €` : "Sur devis"}</span>
                        </div>
                      </div>

                      <button
                        id="reset-cart-btn"
                        onClick={handleReset}
                        className="w-full bg-ink hover:bg-taupe text-white font-semibold text-[10px] uppercase tracking-wider py-3.5 rounded-md transition-all shadow"
                      >
                        Continuer ma visite
                      </button>
                    </motion.div>
                  ) : cartItems.length === 0 ? (
                    /* Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-beige flex items-center justify-center mb-4 border border-accent/40">
                        <ShoppingBag className="w-7 h-7 text-taupe" />
                      </div>
                      <h3 className="text-ink font-display font-semibold italic text-base mb-1">Votre panier est vide</h3>
                      <p className="text-taupe/80 text-xs max-w-xs mb-6 leading-relaxed">
                        Sélectionnez les articles FOHOW de votre choix et cliquez sur « Commander » pour démarrer votre achat.
                      </p>
                      <button
                        id="start-shopping-btn"
                        onClick={onClose}
                        className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-semibold py-2.5 px-6 rounded-md transition-colors"
                      >
                        Parcourir les produits
                      </button>
                    </div>
                  ) : (
                    /* Cart Items List + Form */
                    <div className="space-y-6">
                      {/* Products List */}
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-bold uppercase text-taupe tracking-widest">Vos articles</h3>
                        <div className="divide-y divide-stone-100">
                          {cartItems.map((item) => (
                            <div key={item.product.id} className="py-3 flex gap-3 items-center">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-cover bg-beige/50 border border-accent/20 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-beige/50 border border-accent/20 flex items-center justify-center text-[8px] text-taupe font-bold text-center p-1 shrink-0 select-none">
                                  Pas d'image
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <h4 className="text-xs font-display font-semibold text-ink truncate">{item.product.name}</h4>
                                <p className="text-taupe text-[10px]">{item.product.category}</p>
                                {item.product.price ? (
                                  <span className="text-xs font-bold text-ink">{item.product.price} €</span>
                                ) : (
                                  <span className="text-[10px] text-taupe">Sur devis</span>
                                )}
                              </div>
                              
                              {/* Quantity Adjuster */}
                              <div className="flex items-center gap-1.5 bg-beige/60 border border-accent/20 rounded-lg p-1 shrink-0">
                                <button
                                  id={`qty-minus-${item.product.id}`}
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 rounded hover:bg-white text-taupe transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center text-ink">{item.quantity}</span>
                                <button
                                  id={`qty-plus-${item.product.id}`}
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 rounded hover:bg-white text-taupe transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
 
                              {/* Remove Item */}
                              <button
                                id={`remove-item-${item.product.id}`}
                                onClick={() => onRemoveItem(item.product.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
 
                      {/* Total Bar */}
                      <div className="bg-beige/60 rounded-xl p-4 border border-accent/40">
                        {totalAmount > 0 && (
                          <div className="flex justify-between items-center text-taupe text-xs mb-1.5">
                            <span>Sous-total:</span>
                            <span className="font-semibold text-ink">{totalAmount} €</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-taupe text-xs">
                          <span>Frais de livraison:</span>
                          <span className="text-[#656d4a] font-semibold">Gratuit</span>
                        </div>
                        <div className="h-px bg-accent/40 my-3" />
                        <div className="flex justify-between items-center text-ink font-bold">
                          <span>Montant Total:</span>
                          <span className="text-taupe font-display font-semibold italic text-lg">
                            {totalAmount > 0 ? `${totalAmount} €` : "Sur devis"}
                          </span>
                        </div>
                      </div>
 
                      {/* Delivery and Contact Form */}
                      <form onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-accent/20">
                        <h3 className="text-[10px] font-bold uppercase text-taupe tracking-widest">Informations de Livraison</h3>
                        
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Nom complet *</label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="ex: Jean Dupont"
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink"
                          />
                        </div>
 
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Téléphone *</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="ex: +33 6 12 34 56 78"
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink"
                          />
                        </div>
 
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Adresse Complète *</label>
                          <textarea
                            name="address"
                            required
                            rows={2}
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rue, Code Postal, Ville, Pays"
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink resize-none"
                          />
                        </div>
 
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Email (facultatif)</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="ex: jean.dupont@gmail.com"
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink"
                          />
                        </div>
 
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Mode de règlement</label>
                          <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink"
                          >
                            <option value="delivery_cash">Paiement en espèces à la livraison</option>
                            <option value="bank_transfer">Virement bancaire (avant expédition)</option>
                            <option value="consultation">Consulter un conseiller d'abord</option>
                          </select>
                        </div>
 
                        <div>
                          <label className="block text-[9px] font-bold text-taupe uppercase tracking-widest mb-1">Notes ou instructions spéciales</label>
                          <textarea
                            name="notes"
                            rows={2}
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="ex: préferance d'horaire de livraison..."
                            className="w-full text-xs p-3 rounded-md border border-accent/60 bg-white focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-ink resize-none"
                          />
                        </div>
 
                        <button
                          id="submit-order-btn"
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-ink hover:bg-taupe disabled:bg-stone-300 text-white font-semibold text-[10px] uppercase tracking-wider py-3.5 px-4 rounded-md transition-all shadow flex items-center justify-center gap-2 mt-4 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Valider ma Commande
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
