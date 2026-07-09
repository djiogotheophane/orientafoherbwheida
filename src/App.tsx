import React, { useState, useMemo } from 'react';
import { PRODUCTS, REVIEWS } from './data';
import { Product, CartItem, Category } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { 
  Leaf, 
  Sparkles, 
  Search, 
  Cpu, 
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Application State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open the drawer automatically to show item added
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const categoriesWithProducts = useMemo(() => {
    const displayCategories: string[] = [
      'Compléments alimentaires',
      'Produits de bien-être',
      'Hygiène et soins',
      'Boissons fonctionnelles',
      'Appareils de santé'
    ];
    
    return displayCategories.map(cat => {
      const productsInCat = filteredProducts.filter(p => p.category === cat);
      return { category: cat, products: productsInCat };
    }).filter(item => item.products.length > 0);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-beige text-ink font-sans selection:bg-accent/30 selection:text-ink flex flex-col justify-between">
      
      {/* Top Level Sticky Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Screen Content */}
      <main className="flex-grow">
        
        {/* Luxury Hero Banner Section */}
        <Hero />

        {/* Brand Mission & Philosophy */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="text-taupe text-[10px] font-bold uppercase tracking-widest block mb-2">Notre Vocation</span>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold italic text-ink tracking-tight mb-4">
                Orientation, Conseil et Accompagnement de Confiance
              </h2>
              <p className="text-[#666] text-xs sm:text-sm leading-relaxed">
                Orienta Foherb Whieda est une société dédiée au bien-être et à la vitalité, spécialisée dans la distribution officielle de produits de santé de la marque prestigieuse <a href="https://fohow.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-taupe font-semibold">fohow.com</a>. Nous vous proposons un large choix de compléments alimentaires, produits de bien-être, produits d'hygiène et soins, boissons fonctionnelles et appareils de santé innovants. Forts de notre expertise, nous offrons un accompagnement unique et un suivi d'orientation rigoureux dans tous ces domaines pour vous guider sereinement vers un équilibre de vie sain et harmonieux.
              </p>
            </div>

            {/* Quick Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <div className="bg-beige/40 p-6 rounded-xl border border-accent/30 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-accent/40 text-taupe">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">Tradition Millénaire</h4>
                  <p className="text-[#666] text-xs leading-relaxed">
                    L'utilisation sacrée de plantes souveraines d'Asie comme le Cordyceps du Tibet et le Reishi impérial.
                  </p>
                </div>
              </div>

              <div className="bg-beige/40 p-6 rounded-xl border border-accent/30 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-accent/40 text-taupe">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">Technologie de Pointe</h4>
                  <p className="text-[#666] text-xs leading-relaxed">
                    Extraction par fractionnement cellulaire et broyage submicronique pour une biodisponibilité inégalée.
                  </p>
                </div>
              </div>

              <div className="bg-beige/40 p-6 rounded-xl border border-accent/30 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-accent/40 text-taupe">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">Harmonie & Pureté</h4>
                  <p className="text-[#666] text-xs leading-relaxed">
                    Des formules saines adaptées aux besoins métaboliques des hommes, des femmes et des sportifs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Produits (Our Products Grid with responsive requirements) */}
        <section className="py-16 sm:py-20 bg-gray-light border-t border-stone-200" id="nos-produits">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Grid Header */}
            <div className="text-center sm:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-taupe text-[10px] font-bold uppercase tracking-widest block mb-2">Notre Collection</span>
                <h2 className="text-3xl font-display font-semibold italic text-ink tracking-wide">
                  Nos Produits Fohow & Foherb
                </h2>
                <p className="text-[#666] text-xs sm:text-sm mt-1 max-w-xl">
                  Découvrez nos gammes exclusives d'élixirs liquides, de capsules de nutriments sacrés et d'appareils de haute-technologie bioénergétique.
                </p>
              </div>

              {/* Mobile indicators / results count */}
              <div className="shrink-0 flex items-center justify-center sm:justify-start gap-2 text-xs text-taupe font-semibold">
                <Filter className="w-4 h-4 text-taupe" />
                <span>{filteredProducts.length} produit(s) trouvé(s)</span>
              </div>
            </div>

            {/* Dynamic Search Alert if query yields no results */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-accent/40 p-12 text-center max-w-lg mx-auto">
                <Search className="w-10 h-10 text-taupe mx-auto mb-4" />
                <h3 className="text-ink font-display font-bold text-lg mb-1.5">Aucun produit ne correspond</h3>
                <p className="text-taupe/80 text-xs mb-6">
                  Nous n'avons pas trouvé de résultat pour « {searchQuery} ». Essayez d'utiliser des termes clés plus simples.
                </p>
                <button
                  id="reset-search-btn"
                  onClick={() => { setSearchQuery(''); }}
                  className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-semibold py-2.5 px-5 rounded-md transition-all cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {categoriesWithProducts.map(({ category, products }) => (
                  <div key={category} className="border-b border-stone-200/60 pb-10 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-lg font-display font-semibold italic text-ink tracking-wide">
                        {category}
                      </h3>
                      <span className="bg-taupe/10 text-taupe text-[10px] font-bold py-0.5 px-2.5 rounded-full">
                        {products.length} {products.length > 1 ? 'produits' : 'produit'}
                      </span>
                    </div>
                    {/* Grille Responsive (3 ou 4 produits par ligne sur ordinateur, 2 sur tablette et 1 sur mobile) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onViewDetails={setSelectedProduct}
                          onOrder={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Avis Clients (Authentic Client Testimonials) */}
        {REVIEWS.length > 0 && (
          <section className="py-16 sm:py-20 bg-white border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-taupe text-[10px] font-bold uppercase tracking-widest block mb-2">Témoignages</span>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold italic text-ink tracking-tight">
                  Ils partagent leur expérience d'équilibre retrouvé
                </h2>
                <p className="text-[#666] text-xs sm:text-sm mt-2">
                  Découvrez les retours authentiques de nos clients qui ont intégré FOHOW dans leur routine quotidienne.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="bg-beige border border-accent/40 p-6 rounded-xl flex flex-col justify-between text-left relative">
                    <div>
                      {/* Stars bar */}
                      <div className="flex gap-1 mb-4 text-taupe text-sm">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-[#555] text-xs leading-relaxed italic mb-6">
                        « {review.comment} »
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-semibold text-ink">{review.author}</h4>
                      <span className="text-[10px] text-taupe font-semibold uppercase tracking-wider">Avis Vérifié - {review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Global Product Details Modal Panel */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOrder={handleAddToCart}
      />

      {/* Shopping Cart Drawer Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating WhatsApp Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 flex items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <a
          id="whatsapp-floating-btn"
          href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
            "Bonjour, je souhaite obtenir plus d'informations sur vos produits de santé et bien-être."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#22c35e] transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Contactez-nous sur WhatsApp"
        >
          {/* Pulsing halo */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none" />
          
          {/* Tooltip */}
          <span className="absolute right-16 bg-white text-ink border border-accent/40 text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Besoin d'aide ? Écrivez-nous sur WhatsApp
          </span>
          
          {/* WhatsApp Logo SVG */}
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current z-10" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.012 2c-5.506 0-9.988 4.47-9.988 9.951 0 1.763.459 3.483 1.332 5.011L2 22l5.163-1.348c1.472.798 3.128 1.221 4.831 1.221 5.506 0 9.987-4.47 9.987-9.951C21.98 6.47 17.518 2 12.012 2zm5.794 14.567c-.238.665-1.393 1.284-1.921 1.341-.476.052-.962.083-1.6.083-2.115 0-4.321-.902-5.748-2.316-1.428-1.414-2.348-3.606-2.348-5.706 0-.634.029-1.117.081-1.589.058-.523.681-1.666 1.35-1.892.228-.077.46-.118.694-.118.172 0 .341.009.492.019.349.02.484.054.697.558.261.62.894 2.158.971 2.316.077.158.128.341.022.548-.105.207-.158.334-.316.516-.158.182-.332.404-.475.541-.158.152-.323.318-.139.63.184.312.818 1.332 1.751 2.158.933.826 1.716 1.082 2.036 1.246.321.164.509.139.697-.073.188-.212.809-.941.103-1.815.158-.158.341-.128.548-.051.207.077 1.31.62 1.536.732.226.112.376.168.432.264.056.096.056.551-.182 1.216z"/>
          </svg>
        </a>
      </motion.div>

      {/* Modern & Detailed Footing */}
      <Footer />

    </div>
  );
}
