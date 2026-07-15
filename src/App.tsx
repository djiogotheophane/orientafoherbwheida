import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, REVIEWS } from './data';
import { Product, CartItem, Category, Boutique } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ProductDetailPage from './components/ProductDetailPage';
import BoutiquePage from './components/BoutiquePage';
import { loadProducts, saveProduct, deleteProductFromDb, slugify, deduplicateProducts, loadBoutiques, saveBoutique } from './db';
import { 
  Leaf, 
  Sparkles, 
  Search, 
  Cpu, 
  Filter,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  User,
  ShoppingBag,
  Award,
  Tag,
  Coins,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Store,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Application State - Start completely empty or load from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fohowhope_user_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deduplicateProducts(parsed);
        }
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });
  const [currentSpace, setCurrentSpace] = useState<'client' | 'admin'>('client');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminVerificationOpen, setIsAdminVerificationOpen] = useState(false);
  const [adminVerifyInput, setAdminVerifyInput] = useState('');
  const [adminAttempts, setAdminAttempts] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_admin_attempts') : null;
    return saved ? parseInt(saved, 10) : 0;
  });
  const [adminLockoutUntil, setAdminLockoutUntil] = useState<number | null>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_admin_lockout_until') : null;
    return saved ? parseInt(saved, 10) : null;
  });
  const [adminErrorMsg, setAdminErrorMsg] = useState('');
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<string>('');

  // Countdown timer for lockout
  useEffect(() => {
    if (!adminLockoutUntil) return;
    
    const updateTimer = () => {
      const diff = adminLockoutUntil - Date.now();
      if (diff <= 0) {
        setAdminLockoutUntil(null);
        setAdminAttempts(0);
        localStorage.removeItem('fohowhope_admin_lockout_until');
        localStorage.setItem('fohowhope_admin_attempts', '0');
        setLockoutTimeLeft('');
        setAdminErrorMsg('');
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setLockoutTimeLeft(`${mins}m ${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [adminLockoutUntil]);

  const handleVerifyAdminCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check lockout first
    if (adminLockoutUntil && Date.now() < adminLockoutUntil) {
      return;
    }

    const trimmedInput = adminVerifyInput.trim();
    if (trimmedInput === 'OrientaFoherbWhieda70') {
      setIsAdminUnlocked(true);
      setCurrentSpace('admin');
      setIsAdminVerificationOpen(false);
      setAdminVerifyInput('');
      setAdminErrorMsg('');
      setAdminAttempts(0);
      localStorage.removeItem('fohowhope_admin_attempts');
      localStorage.removeItem('fohowhope_admin_lockout_until');
    } else {
      const newAttempts = adminAttempts + 1;
      setAdminAttempts(newAttempts);
      localStorage.setItem('fohowhope_admin_attempts', newAttempts.toString());

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 3600000; // 1 hour
        setAdminLockoutUntil(lockoutTime);
        localStorage.setItem('fohowhope_admin_lockout_until', lockoutTime.toString());
        setAdminErrorMsg('Trop de tentatives infructueuses. Accès bloqué pendant 1 heure.');
      } else {
        setAdminErrorMsg(`Code incorrect. Il vous reste ${5 - newAttempts} tentative(s).`);
      }
    }
  };

  const handleSpaceChange = (space: 'client' | 'admin') => {
    if (space === 'admin') {
      if (!isAdminUnlocked) {
        setIsAdminVerificationOpen(true);
        return;
      }
    } else {
      setIsAdminUnlocked(false);
    }
    setCurrentSpace(space);
  };
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [currentBoutique, setCurrentBoutique] = useState<Boutique | null>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_logged_in_boutique') : null;
    return saved ? JSON.parse(saved) : null;
  });
  const [signupEmail, setSignupEmail] = useState('');
  const [signupSellerName, setSignupSellerName] = useState('');
  const [signupShopName, setSignupShopName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('fohowhope_user_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Custom Client Space Texts
  const [clientTexts, setClientTexts] = useState(() => {
    const saved = localStorage.getItem('fohowhope_client_texts');
    const defaultTexts = {
      heroTagline: "Partenaire Officiel FOHOW & FOHERB",
      heroTitle: "Orienta",
      heroSubtitle: "Foherb Whieda",
      heroDescription: "Orienta Foherb Whieda est une société spécialisée dans la vente de produits de santé d'excellence issus de la marque de prestige internationale fohow.com. Nous proposons des compléments alimentaires, des produits de bien-être, d'hygiène et soins, des boissons fonctionnelles ainsi que des appareils de santé avancés. Profitez également d'un véritable suivi d'orientation personnalisé dans chacun de ces domaines.",
      heroButtonText: "Découvrir nos Produits",
      vocationTitle: "Orientation, Conseil et Accompagnement de Confiance",
      vocationDescription: "Orienta Foherb Whieda est une société dédiée au bien-être et à la vitalité, spécialisée dans la distribution officielle de produits de santé de la marque prestigieuse fohow.com. Nous vous proposons un large choix de compléments alimentaires, produits de bien-être, produits d'hygiène et soins, boissons fonctionnelles et appareils de santé innovants. Forts de notre expertise, nous offrons un accompagnement unique et un suivi d'orientation rigoureux dans tous ces domaines pour vous guider sereinement vers un équilibre de vie sain et harmonieux."
    };
    if (saved) {
      try {
        return { ...defaultTexts, ...JSON.parse(saved) };
      } catch (e) {
        return defaultTexts;
      }
    }
    return defaultTexts;
  });

  useEffect(() => {
    localStorage.setItem('fohowhope_client_texts', JSON.stringify(clientTexts));
  }, [clientTexts]);

  // Routing State
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        return hash.slice(1);
      }
      return window.location.pathname;
    }
    return '/';
  });

  // Navigate function supporting both clean HTML5 history and hash fallbacks
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.location.hash = path;
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        setCurrentPath(hash.slice(1));
      } else {
        setCurrentPath(window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Load products & boutiques from Database on Mount (Firestore and localStorage sync)
  useEffect(() => {
    async function initDbData() {
      const isCleared = localStorage.getItem('fohowhope_first_time_clear_products_v3');
      if (!isCleared) {
        localStorage.removeItem('fohowhope_user_products');
        localStorage.setItem('fohowhope_first_time_clear_products_v3', 'true');
        setProducts([]);
        
        // Asynchronously clean Firestore products if Firestore is set up
        try {
          const { getDb } = await import('./db');
          const db = await getDb();
          if (db) {
            const firestoreModule = await import('firebase/firestore');
            const productsCol = firestoreModule.collection(db, 'products');
            const snapshot = await firestoreModule.getDocs(productsCol);
            for (const d of snapshot.docs) {
              await firestoreModule.deleteDoc(firestoreModule.doc(db, 'products', d.id));
            }
          }
        } catch (e) {
          console.log("Firestore cleaning ignored or completed.");
        }
      } else {
        const loadedProds = await loadProducts();
        setProducts(deduplicateProducts(loadedProds));
      }
      
      const loadedBouts = await loadBoutiques();
      setBoutiques(loadedBouts);
    }
    initDbData();
  }, []);

  // Form State for Adding Product
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Category>('Compléments alimentaires');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductBenefits, setNewProductBenefits] = useState('');
  const [newProductHowToUse, setNewProductHowToUse] = useState('');
  const [newProductIngredients, setNewProductIngredients] = useState('');
  const [newProductSellerName, setNewProductSellerName] = useState(() => {
    const savedBoutique = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_logged_in_boutique') : null;
    if (savedBoutique) {
      try {
        const parsed = JSON.parse(savedBoutique);
        return parsed?.sellerName || 'Orienta';
      } catch (e) {
        // Fallback
      }
    }
    return 'Orienta';
  });

  // Sync newProductSellerName with current logged in boutique automatically
  useEffect(() => {
    if (currentBoutique) {
      setNewProductSellerName(currentBoutique.sellerName);
    } else {
      setNewProductSellerName('Orienta');
    }
  }, [currentBoutique]);

  // Persist products to localStorage (secondary cache)
  useEffect(() => {
    localStorage.setItem('fohowhope_user_products', JSON.stringify(products));
  }, [products]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('fohowhope_user_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle local image file upload & conversion to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProductImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new product action
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert('Veuillez entrer le nom du produit.');
      return;
    }
    if (!newProductImage) {
      alert('Veuillez importer une image depuis votre appareil.');
      return;
    }

    const benefitsArray = newProductBenefits
      ? newProductBenefits.split('\n').map(b => b.trim()).filter(b => b.length > 0)
      : [];
    const ingredientsArray = newProductIngredients
      ? newProductIngredients.split(',').map(i => i.trim()).filter(i => i.length > 0)
      : [];

    const sellerNameTrimmed = currentBoutique ? currentBoutique.sellerName : (newProductSellerName.trim() || 'Orienta');
    const sellerSlug = currentBoutique ? currentBoutique.sellerSlug : slugify(sellerNameTrimmed);
    const productSlug = slugify(newProductName.trim());

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      description: newProductDescription.trim(),
      image: newProductImage,
      price: newProductPrice ? parseFloat(newProductPrice) : undefined,
      benefits: benefitsArray.length > 0 ? benefitsArray : undefined,
      howToUse: newProductHowToUse.trim() || undefined,
      ingredients: ingredientsArray.length > 0 ? ingredientsArray : undefined,
      sellerName: sellerNameTrimmed,
      sellerSlug,
      productSlug,
    };

    saveProduct(newProduct).then(() => {
      setProducts(prev => deduplicateProducts([newProduct, ...prev]));
    });

    // Reset Form Fields
    setNewProductName('');
    setNewProductCategory('Compléments alimentaires');
    setNewProductDescription('');
    setNewProductPrice('');
    setNewProductImage('');
    setNewProductBenefits('');
    setNewProductHowToUse('');
    setNewProductIngredients('');
    setNewProductSellerName(currentBoutique ? currentBoutique.sellerName : 'Orienta');

    setIsAddModalOpen(false);
  };

  // Boutique registration and login handlers
  const handleCreateBoutique = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail.trim() || !signupSellerName.trim() || !signupShopName.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    const sellerSlug = slugify(signupSellerName.trim());
    
    // Check if boutique already exists with this slug
    const alreadyExists = boutiques.some(b => b.sellerSlug === sellerSlug);
    if (alreadyExists) {
      alert("Ce nom de conseiller est déjà pris par une autre boutique. Veuillez en utiliser un autre.");
      return;
    }

    const uniqueId = `shop-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBoutique: Boutique = {
      id: uniqueId,
      email: signupEmail.trim().toLowerCase(),
      sellerName: signupSellerName.trim(),
      sellerSlug,
      shopName: signupShopName.trim(),
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    await saveBoutique(newBoutique);
    setBoutiques(prev => [newBoutique, ...prev]);
    setCurrentBoutique(newBoutique);
    localStorage.setItem('fohowhope_logged_in_boutique', JSON.stringify(newBoutique));

    alert(`Votre compte et votre boutique ont été créés avec succès !\nIdentifiant de boutique : ${uniqueId}`);
    
    // Clear forms
    setSignupEmail('');
    setSignupSellerName('');
    setSignupShopName('');
  };

  const handleLoginBoutique = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      alert("Veuillez entrer votre adresse email.");
      return;
    }
    const emailLower = loginEmail.trim().toLowerCase();
    const found = boutiques.find(b => b.email === emailLower);
    if (found) {
      setCurrentBoutique(found);
      localStorage.setItem('fohowhope_logged_in_boutique', JSON.stringify(found));
      alert(`Heureux de vous revoir sur votre espace admin, ${found.sellerName} !`);
      setLoginEmail('');
    } else {
      alert("Aucune boutique trouvée avec cette adresse email. Veuillez en créer une.");
    }
  };

  const handleLogoutBoutique = () => {
    if (confirm("Voulez-vous vous déconnecter de votre espace administrateur ?")) {
      setCurrentBoutique(null);
      localStorage.removeItem('fohowhope_logged_in_boutique');
    }
  };

  // Delete product action
  const handleDeleteProduct = (productId: string) => {
    deleteProductFromDb(productId).then(() => {
      setProducts(prev => prev.filter(p => p.id !== productId));
    });
    // Also remove from cart if present
    setCart(prev => prev.filter(item => item.product.id !== productId));
    // Close modal if selected
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleViewDetails = (product: Product) => {
    navigateTo(`/produit/${product.productSlug || product.id}`);
  };

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
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

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

  // Dynamic Route Matching
  const route = useMemo(() => {
    if (currentPath.startsWith('/produit/')) {
      return { type: 'product', idOrSlug: currentPath.slice('/produit/'.length) };
    }
    if (currentPath.startsWith('/boutique/')) {
      return { type: 'boutique', sellerSlug: currentPath.slice('/boutique/'.length) };
    }
    return { type: 'home' };
  }, [currentPath]);

  const matchedProduct = useMemo(() => {
    if (route.type !== 'product') return null;
    return products.find(p => p.id === route.idOrSlug || p.productSlug === route.idOrSlug);
  }, [route, products]);

  const sellerProducts = useMemo(() => {
    if (route.type !== 'boutique') return [];
    return products.filter(p => p.sellerSlug === route.sellerSlug);
  }, [route, products]);

  return (
    <div className="min-h-screen bg-beige text-ink font-sans selection:bg-accent/30 selection:text-ink flex flex-col justify-between">
      
      {/* Top Level Sticky Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentSpace={currentSpace}
        onSpaceChange={handleSpaceChange}
        onLogoClick={() => navigateTo('/')}
      />

      {/* Main Screen Content */}
      <main className="flex-grow">
        {route.type === 'product' ? (
          matchedProduct ? (
            <ProductDetailPage 
              product={matchedProduct} 
              onNavigate={navigateTo} 
              onAddToCart={handleAddToCart} 
            />
          ) : (
            <div className="bg-beige/20 min-h-screen py-20 text-center flex flex-col items-center justify-center">
              <h2 className="text-2xl font-display font-semibold italic text-ink mb-4">Produit non trouvé</h2>
              <p className="text-xs text-taupe mb-6 max-w-md">Le produit que vous recherchez n'existe pas ou a été supprimé par l'administrateur.</p>
              <button onClick={() => navigateTo('/')} className="bg-ink hover:bg-taupe text-white text-[11px] uppercase tracking-wider font-bold py-2.5 px-6 rounded-md cursor-pointer">Retour à l'accueil</button>
            </div>
          )
        ) : route.type === 'boutique' ? (
          <BoutiquePage 
            sellerProducts={sellerProducts} 
            sellerSlug={route.sellerSlug || ''} 
            onNavigate={navigateTo} 
            onAddToCart={handleAddToCart} 
            onViewDetails={setSelectedProduct} 
            onDeleteProduct={handleDeleteProduct} 
            currentSpace={currentSpace} 
            boutiques={boutiques}
          />
        ) : (
          <>
            {/* Luxury Hero Banner Section */}
            <Hero 
              tagline={clientTexts.heroTagline}
              title={clientTexts.heroTitle}
              subtitle={clientTexts.heroSubtitle}
              description={clientTexts.heroDescription}
              buttonText={clientTexts.heroButtonText}
            />

        {/* Brand Mission & Philosophy */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="text-taupe text-[10px] font-bold uppercase tracking-widest block mb-2">Notre Vocation</span>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold italic text-ink tracking-tight mb-4">
                {clientTexts.vocationTitle}
              </h2>
              <p className="text-[#666] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {clientTexts.vocationDescription}
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

        {/* Nos Produits & Workspace Areas */}
        <section className="py-16 sm:py-20 bg-gray-light border-t border-stone-200" id="nos-produits">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Dynamic Dashboard Switch Header */}
            <div className="mb-10">
              {currentSpace === 'admin' && (
                <span className="text-taupe text-[10px] font-bold uppercase tracking-widest block mb-1">
                  Tableau de Bord Marchand
                </span>
              )}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-display font-semibold italic text-ink tracking-wide">
                    {currentSpace === 'client' ? 'Votre Espace Client Personnel' : 'Gestion du Magasin Orienta'}
                  </h2>
                  <p className="text-[#666] text-xs sm:text-sm mt-1 max-w-xl">
                    {currentSpace === 'client' 
                      ? 'Consultez votre carte de fidélité, suivez vos commandes en cours et explorez notre catalogue complet de remèdes souverains.'
                      : 'Supervisez vos produits, gérez vos ventes virtuelles et enrichissez votre catalogue de nouvelles références.'}
                  </p>
                </div>
                
                {/* Search & Active Filters Status */}
                <div className="flex items-center gap-2 text-xs text-taupe font-semibold self-start md:self-end">
                  <Filter className="w-4 h-4 text-taupe" />
                  <span>{filteredProducts.length} produit(s) disponible(s)</span>
                </div>
              </div>
            </div>

            {/* ESPACE CLIENT - PERSONAL DASHBOARD WIDGET */}
            <AnimatePresence mode="wait">
              {currentSpace === 'client' && (
                <motion.div 
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
                  id="client-space-dashboard"
                >
                  {/* Loyalty Points Card */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-6 border border-stone-800 shadow-lg flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-taupe/10 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-taupe text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" /> Fohow Gold Club
                        </span>
                        <Coins className="w-5 h-5 text-taupe animate-pulse" />
                      </div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-mono">Membre Privilège</p>
                      <h4 className="text-sm font-semibold tracking-wide text-stone-200 truncate mt-1">djiogotheophane@gmail.com</h4>
                      
                      {/* Points Counter */}
                      <div className="my-5">
                        <div className="text-3xl font-display font-bold italic text-white flex items-baseline gap-1.5">
                          {50 + orders.reduce((acc, o) => acc + (o.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0) * 10, 0)}
                          <span className="text-xs font-sans not-italic font-medium text-stone-400">pts</span>
                        </div>
                        <div className="w-full bg-stone-800 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="bg-taupe h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, ((50 + orders.reduce((acc, o) => acc + (o.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0) * 10, 0)) / 200) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 mt-1.5">Prochain cadeau à 200 points ! (10 points par produit commandé)</p>
                      </div>
                    </div>
                    <div className="text-[9px] text-stone-500 border-t border-stone-800 pt-3">
                      Numéro de carte : <span className="font-mono text-stone-400">FID-2026-94812</span>
                    </div>
                  </div>

                  {/* Order Tracker Card */}
                  <div className="bg-white rounded-2xl p-6 border border-accent/40 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-taupe flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-taupe" /> Suivi de vos Commandes
                        </h4>
                        <span className="bg-taupe/10 text-taupe text-[10px] font-bold py-0.5 px-2 rounded-full">
                          {orders.length} commande(s)
                        </span>
                      </div>

                      {/* Orders Content list */}
                      <div className="overflow-y-auto max-h-[160px] pr-1 space-y-2.5 divide-y divide-stone-100" id="orders-scroll-container">
                        {orders.length === 0 ? (
                          <div className="text-center py-8">
                            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="text-[10px] text-stone-500 leading-relaxed">
                              Aucune commande passée.<br />Vos achats validés s'afficheront ici.
                            </p>
                          </div>
                        ) : (
                          orders.map((ord, idx) => (
                            <div key={ord.id} className={`pt-2.5 first:pt-0 ${idx > 0 ? 'mt-1' : ''}`}>
                              <div className="flex justify-between items-center text-[10px] mb-1">
                                <span className="font-bold text-ink">{ord.id}</span>
                                <span className="text-stone-400">{ord.date}</span>
                              </div>
                              <p className="text-[9px] text-stone-500 truncate mb-1.5">
                                {ord.items.map((it: any) => `${it.quantity}x ${it.product.name}`).join(', ')}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-taupe">{ord.total?.toLocaleString('fr-FR')} FCFA</span>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#656d4a] bg-[#656d4a]/10 px-1.5 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#656d4a] animate-pulse" /> {ord.status}
                                  </span>
                                  <a 
                                    href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                                      `Bonjour, je souhaite suivre ma commande Orienta ${ord.id} validée le ${ord.date} d'un montant de ${ord.total?.toLocaleString('fr-FR')} FCFA.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[8px] font-bold text-white bg-[#25D366] hover:bg-[#22c35e] px-2 py-0.5 rounded transition-colors"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-stone-100 my-2" />
                    <p className="text-[9px] text-stone-400 text-center">
                      Orienta valide vos commandes et prend contact avec vous sous 24h.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ESPACE ADMINISTRATEUR - METRICS & QUICK ACTIONS */}
            <AnimatePresence mode="wait">
              {currentSpace === 'admin' && (
                <motion.div 
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                  id="admin-space-dashboard"
                >
                  {!currentBoutique ? (
                    /* SIGN UP & LOGIN PANEL FOR BOUTIQUE */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl border border-accent/40 shadow-xs p-6 sm:p-8 mb-6">
                      {/* Create Account Form */}
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 bg-[#656d4a]/10 text-[#656d4a] py-1 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          Nouveau Conseiller
                        </div>
                        <h3 className="text-xl font-display font-semibold text-ink">Créer mon espace & ma boutique</h3>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          Remplissez le formulaire ci-dessous pour obtenir instantanément votre identifiant unique, votre lien de boutique personnalisé, et commencez à publier vos produits Fohow.
                        </p>
                        
                        <form onSubmit={handleCreateBoutique} className="space-y-3 pt-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-taupe mb-1">Votre Nom Complet (Conseiller)</label>
                            <input 
                              type="text" 
                              required
                              value={signupSellerName}
                              onChange={(e) => setSignupSellerName(e.target.value)}
                              placeholder="Ex: Jean-Luc Dupont" 
                              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-taupe mb-1">Votre Adresse Email</label>
                            <input 
                              type="email" 
                              required
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              placeholder="Ex: jean.luc@example.com" 
                              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-taupe mb-1">Nom de votre Boutique</label>
                            <input 
                              type="text" 
                              required
                              value={signupShopName}
                              onChange={(e) => setSignupShopName(e.target.value)}
                              placeholder="Ex: Fohow Bien-être Paris" 
                              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                            />
                          </div>
                          
                          <button 
                            type="submit"
                            className="w-full bg-[#656d4a] hover:bg-[#52583b] text-white text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Créer ma Boutique & Générer mon Lien
                          </button>
                        </form>
                      </div>

                      {/* Login Form */}
                      <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-taupe/10 text-taupe py-1 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                            <User className="w-3.5 h-3.5" />
                            Accès Conseiller
                          </div>
                          <h3 className="text-xl font-display font-semibold text-ink mt-2">Me connecter à mon espace</h3>
                          <p className="text-[11px] text-stone-500 leading-relaxed mt-2">
                            Si vous avez déjà configuré votre espace, saisissez l'adresse e-mail associée à votre boutique pour la retrouver.
                          </p>
                          
                          <form onSubmit={handleLoginBoutique} className="space-y-3 pt-6">
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-taupe mb-1">Votre Adresse Email de Boutique</label>
                              <input 
                                type="email" 
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="Saisissez votre email" 
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                              />
                            </div>
                            
                            <button 
                              type="submit"
                              className="w-full bg-taupe hover:bg-ink text-white text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Me connecter à mon espace
                            </button>
                          </form>
                        </div>

                        <div className="bg-beige/40 rounded-xl p-4 border border-accent/30 text-center mt-6">
                          <span className="text-[9px] font-bold text-taupe block mb-1">Besoin d'aide ?</span>
                          <p className="text-[10px] text-stone-500">Contactez le support administratif en cas de perte de vos informations de connexion.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* LOGGED IN BOUTIQUE DASHBOARD & LINK VIEWER */
                    <div className="space-y-6">
                      {/* Shop Owner Info & Copier/Voir Actions */}
                      <div className="bg-white rounded-3xl border border-accent/40 shadow-xs p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Store className="w-32 h-32 text-taupe" />
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10 relative">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#656d4a]/10 text-[#656d4a] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                Boutique Active
                              </span>
                              <span className="bg-taupe/10 text-taupe text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                ID: {currentBoutique.id}
                              </span>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-ink italic">
                              {currentBoutique.shopName}
                            </h2>
                            <p className="text-xs text-stone-500">
                              Gérée par <span className="font-semibold text-stone-700">{currentBoutique.sellerName}</span> ({currentBoutique.email}) • Créée le {currentBoutique.createdAt}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/#/boutique/${currentBoutique.sellerSlug}`;
                                navigator.clipboard.writeText(link);
                                setCopiedLink(true);
                                setTimeout(() => setCopiedLink(false), 2000);
                              }}
                              className="grow sm:grow-0 bg-white hover:bg-stone-50 text-ink border border-accent/40 text-[10px] uppercase tracking-wider font-bold py-3 px-5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier mon lien</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                handleSpaceChange('client');
                                navigateTo(`/boutique/${currentBoutique.sellerSlug}`);
                              }}
                              className="grow sm:grow-0 bg-[#656d4a] hover:bg-[#52583b] text-white text-[10px] uppercase tracking-wider font-bold py-3 px-5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Voir ma boutique</span>
                            </button>

                            <button
                              onClick={handleLogoutBoutique}
                              className="grow sm:grow-0 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] uppercase tracking-wider font-bold py-3 px-4 rounded-lg transition-all cursor-pointer"
                            >
                              Déconnexion
                            </button>
                          </div>
                        </div>

                        {/* Beautiful generated URL display */}
                        <div className="mt-6 bg-beige/30 border border-accent/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-taupe uppercase tracking-wider block">Votre Lien Personnel de Vente</span>
                            <code className="text-xs font-mono text-[#656d4a] break-all">
                              {window.location.origin}/#/boutique/{currentBoutique.sellerSlug}
                            </code>
                          </div>
                          <span className="text-[10px] text-stone-500 bg-white border border-stone-100 rounded-md py-1 px-2.5 font-sans whitespace-nowrap">
                            Actif pour tous les visiteurs 🟢
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                        {/* Stat 1: Total Products */}
                        <div className="bg-white rounded-2xl p-6 border border-accent/40 shadow-xs flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-beige flex items-center justify-center text-taupe shrink-0">
                            <Leaf className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-taupe">Produits au catalogue</span>
                            <h4 className="text-2xl font-display font-bold text-ink mt-0.5">
                              {products.length}
                            </h4>
                          </div>
                        </div>

                        {/* Stat 2: Total Orders */}
                        <div className="bg-white rounded-2xl p-6 border border-accent/40 shadow-xs flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-beige flex items-center justify-center text-taupe shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-taupe">Commandes clients</span>
                            <h4 className="text-2xl font-display font-bold text-ink mt-0.5">
                              {orders.length}
                            </h4>
                          </div>
                        </div>

                        {/* Stat 3: Total Simulated Sales */}
                        <div className="bg-white rounded-2xl p-6 border border-accent/40 shadow-xs flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-beige flex items-center justify-center text-taupe shrink-0">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-taupe">Chiffre d'Affaires</span>
                            <h4 className="text-2xl font-display font-bold text-ink mt-0.5">
                              {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('fr-FR')} FCFA
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Admin Quick Action Bar */}
                      <div className="bg-beige/40 rounded-xl border border-accent/30 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                          <h4 className="text-xs font-bold text-ink">Action requise de l'administrateur</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">Ajoutez de nouveaux produits Fohow pour alimenter la vitrine de vos clients.</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <button
                            onClick={async () => {
                              if (confirm('Voulez-vous vraiment vider toutes les données du catalogue et des commandes de la base de données ?')) {
                                setProducts([]);
                                setOrders([]);
                                setCart([]);
                                localStorage.removeItem('fohowhope_user_products');
                                localStorage.removeItem('fohowhope_user_orders');
                                
                                // Reset Firestore if active
                                try {
                                  const { getDb } = await import('./db');
                                  const db = await getDb();
                                  if (db) {
                                    const firestoreModule = await import('firebase/firestore');
                                    
                                    // Delete products
                                    const productsCol = firestoreModule.collection(db, 'products');
                                    const prodSnapshot = await firestoreModule.getDocs(productsCol);
                                    for (const d of prodSnapshot.docs) {
                                      await firestoreModule.deleteDoc(firestoreModule.doc(db, 'products', d.id));
                                    }
                                    
                                    // Delete boutiques except maybe the primary/logged-in one, or keep them
                                    console.log("Firestore products wiped.");
                                  }
                                } catch (e) {
                                  console.error("Failed to delete Firestore collection items:", e);
                                }
                                
                                alert('Les données du catalogue et des commandes ont été réinitialisées.');
                              }
                            }}
                            className="bg-white hover:bg-stone-50 text-rose-600 border border-rose-200 text-[10px] uppercase tracking-wider font-bold py-3 px-5 rounded-md transition-colors cursor-pointer"
                          >
                            Tout réinitialiser
                          </button>
                          <button
                            id="add-product-admin-widget-btn"
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-taupe hover:bg-ink text-white text-[10px] uppercase tracking-wider font-bold py-3 px-5 rounded-md shadow transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Ajouter un produit
                          </button>
                        </div>
                      </div>

                      {/* Personnalisation des textes du site (Espace Client) */}
                      <div className="bg-white rounded-3xl border border-accent/40 shadow-xs p-6 sm:p-8 mt-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-lg font-display font-bold text-ink italic">Personnaliser les textes de l'Espace Client</h3>
                            <p className="text-[11px] text-stone-500">Modifiez instantanément les slogans, titres et paragraphes visibles par vos visiteurs sur la page d'accueil.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                          {/* Left Column: Hero Text Settings */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-taupe uppercase tracking-widest border-b border-stone-50 pb-2">1. Section de Bienvenue (Hero)</h4>
                            
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Badge d'en-tête (Tagline)</label>
                              <input 
                                type="text"
                                value={clientTexts.heroTagline}
                                onChange={(e) => setClientTexts({ ...clientTexts, heroTagline: e.target.value })}
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                                placeholder="Partenaire Officiel FOHOW & FOHERB"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Titre Principal</label>
                                <input 
                                  type="text"
                                  value={clientTexts.heroTitle}
                                  onChange={(e) => setClientTexts({ ...clientTexts, heroTitle: e.target.value })}
                                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                                  placeholder="Orienta"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Sous-Titre</label>
                                <input 
                                  type="text"
                                  value={clientTexts.heroSubtitle}
                                  onChange={(e) => setClientTexts({ ...clientTexts, heroSubtitle: e.target.value })}
                                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                                  placeholder="Foherb Whieda"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Texte du bouton</label>
                              <input 
                                type="text"
                                value={clientTexts.heroButtonText}
                                onChange={(e) => setClientTexts({ ...clientTexts, heroButtonText: e.target.value })}
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                                placeholder="Découvrir nos Produits"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Texte de description du Hero</label>
                              <textarea 
                                rows={4}
                                value={clientTexts.heroDescription}
                                onChange={(e) => setClientTexts({ ...clientTexts, heroDescription: e.target.value })}
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50 resize-none leading-relaxed"
                                placeholder="Orienta Foherb Whieda est une société..."
                              />
                            </div>
                          </div>

                          {/* Right Column: Vocation & Philosophy settings */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-taupe uppercase tracking-widest border-b border-stone-50 pb-2">2. Section Vocation &amp; Philosophie</h4>
                            
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Titre de la Vocation</label>
                              <input 
                                type="text"
                                value={clientTexts.vocationTitle}
                                onChange={(e) => setClientTexts({ ...clientTexts, vocationTitle: e.target.value })}
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50"
                                placeholder="Orientation, Conseil et Accompagnement de Confiance"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Texte détaillé de la Vocation</label>
                              <textarea 
                                rows={8}
                                value={clientTexts.vocationDescription}
                                onChange={(e) => setClientTexts({ ...clientTexts, vocationDescription: e.target.value })}
                                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-accent/40 focus:outline-none focus:border-taupe bg-stone-50 resize-none leading-relaxed"
                                placeholder="Orienta Foherb Whieda est une société dédiée au bien-être..."
                              />
                            </div>

                            <div className="flex gap-3 pt-4 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Voulez-vous vraiment réinitialiser les textes à leurs valeurs d\'origine ?')) {
                                    setClientTexts({
                                      heroTagline: "Partenaire Officiel FOHOW & FOHERB",
                                      heroTitle: "Orienta",
                                      heroSubtitle: "Foherb Whieda",
                                      heroDescription: "Orienta Foherb Whieda est une société spécialisée dans la vente de produits de santé d'excellence issus de la marque de prestige internationale fohow.com. Nous proposons des compléments alimentaires, des produits de bien-être, d'hygiène et soins, des boissons fonctionnelles ainsi que des appareils de santé avancés. Profitez également d'un véritable suivi d'orientation personnalisé dans chacun de ces domaines.",
                                      heroButtonText: "Découvrir nos Produits",
                                      vocationTitle: "Orientation, Conseil et Accompagnement de Confiance",
                                      vocationDescription: "Orienta Foherb Whieda est une société dédiée au bien-être et à la vitalité, spécialisée dans la distribution officielle de produits de santé de la marque prestigieuse fohow.com. Nous vous proposons un large choix de compléments alimentaires, produits de bien-être, produits d'hygiène et soins, boissons fonctionnelles et appareils de santé innovants. Forts de notre expertise, nous offrons un accompagnement unique et un suivi d'orientation rigoureux dans tous ces domaines pour vous guider sereinement vers un équilibre de vie sain et harmonieux."
                                    });
                                    alert('Les textes du site ont été réinitialisés aux valeurs par défaut.');
                                  }
                                }}
                                className="bg-white hover:bg-stone-50 text-stone-500 border border-stone-200 text-[10px] uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                              >
                                Réinitialiser par défaut
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  alert('🎉 Vos modifications ont bien été enregistrées et appliquées en temps réel sur l\'Espace Client !');
                                }}
                                className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-bold py-2.5 px-5 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="w-4 h-4 text-white" /> Enregistrer les modifications
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-accent/40 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/30 text-taupe">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-ink font-display font-bold text-xl mb-3">Votre catalogue est vide !</h3>
                <p className="text-taupe/80 text-xs sm:text-sm mb-8 leading-relaxed max-w-md mx-auto">
                  Il n'y a actuellement aucun produit sur le site. {currentSpace === 'admin' 
                    ? 'Cliquez sur le bouton ci-dessous pour importer vos propres images et créer vos produits Fohow & Foherb personnalisés.'
                    : 'Le catalogue ne contient pas encore de produits.'}
                </p>
                {currentSpace === 'admin' && (
                  <button
                    id="add-first-product-btn"
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-ink hover:bg-taupe text-white text-[11px] uppercase tracking-wider font-semibold py-3.5 px-8 rounded-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  >
                    Ajouter mon premier produit
                  </button>
                )}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-accent/40 p-12 text-center max-w-lg mx-auto">
                <Search className="w-10 h-10 text-taupe mx-auto mb-4" />
                <h3 className="text-ink font-display font-bold text-lg mb-1.5">Aucun produit ne correspond</h3>
                <p className="text-taupe/80 text-xs mb-6">
                  {currentSpace === 'admin' 
                    ? "Vous n'avez aucun produit dans le catalogue de produits pour le moment."
                    : `Nous n'avons pas trouvé de résultat pour « ${searchQuery} ». Essayez d'utiliser des termes clés plus simples.`}
                </p>
                {currentSpace === 'admin' ? (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-semibold py-2.5 px-5 rounded-md transition-all cursor-pointer"
                  >
                    Ajouter votre premier produit
                  </button>
                ) : (
                  <button
                    id="reset-search-btn"
                    onClick={() => { setSearchQuery(''); }}
                    className="bg-ink hover:bg-taupe text-white text-[10px] uppercase tracking-wider font-semibold py-2.5 px-5 rounded-md transition-all cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
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
                          onViewDetails={handleViewDetails}
                          onOrder={handleAddToCart}
                          onDelete={currentSpace === 'admin' ? handleDeleteProduct : undefined}
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
          </>
        )}
      </main>

      {/* Global Product Details Modal Panel */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOrder={handleAddToCart}
      />

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl border border-accent/40 shadow-xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-beige/30 shrink-0">
                <div>
                  <h3 className="font-display font-bold text-lg text-ink">Ajouter un nouveau produit</h3>
                  <p className="text-xs text-taupe mt-0.5 font-sans">Créez un produit personnalisé avec votre propre image</p>
                </div>
                <button
                  id="close-add-modal-btn"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-400 hover:text-ink cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddProduct} className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-2 font-sans">
                    Image du produit *
                  </label>
                  {!newProductImage ? (
                    <div 
                      onClick={() => document.getElementById('new-product-file-input')?.click()}
                      className="border-2 border-dashed border-stone-200 hover:border-taupe bg-stone-50/50 rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 group flex flex-col items-center justify-center min-h-[180px]"
                    >
                      <input
                        type="file"
                        id="new-product-file-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-stone-200 text-stone-400 group-hover:text-taupe group-hover:border-taupe/50 transition-colors shadow-xs mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-ink font-sans">Importer depuis mon appareil</p>
                      <p className="text-[10px] text-taupe/80 mt-1 font-sans">PNG, JPG ou WEBP (Glisser-déposer ou cliquer)</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl border border-accent/40 p-3 bg-beige/20 flex flex-col items-center justify-center min-h-[180px]">
                      <img
                        src={newProductImage}
                        alt="Aperçu du produit"
                        className="max-h-[140px] object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setNewProductImage('')}
                        className="absolute top-3 right-3 bg-white hover:bg-rose-50 text-rose-600 p-1.5 rounded-full shadow-md border border-stone-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                        title="Supprimer l'image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold mt-2 font-sans">
                        Image chargée avec succès
                      </span>
                    </div>
                  )}
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Thé Liuwei Cha Impérial"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none transition-all text-ink font-sans"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                      Catégorie *
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value as Category)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3 rounded-lg outline-none transition-all text-ink cursor-pointer font-sans"
                    >
                      <option value="Compléments alimentaires">Compléments alimentaires</option>
                      <option value="Produits de bien-être">Produits de bien-être</option>
                      <option value="Hygiène et soins">Hygiène et soins</option>
                      <option value="Boissons fonctionnelles">Boissons fonctionnelles</option>
                      <option value="Appareils de santé">Appareils de santé</option>
                    </select>
                  </div>

                  {/* Seller / Boutique */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                      Conseiller / Boutique *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!currentBoutique}
                      placeholder="Ex: Orienta, Jean-Luc"
                      value={currentBoutique ? currentBoutique.sellerName : newProductSellerName}
                      onChange={(e) => setNewProductSellerName(e.target.value)}
                      className={`w-full border text-xs py-2.5 px-3.5 rounded-lg outline-none transition-all text-ink font-sans ${
                        currentBoutique 
                          ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' 
                          : 'bg-stone-50 border-stone-200 focus:border-taupe focus:bg-white'
                      }`}
                    />
                    {currentBoutique && (
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 font-sans">
                        Associé automatiquement à votre boutique active
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                    Description du produit *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Entrez une description attrayante du produit..."
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none resize-none transition-all text-ink leading-relaxed font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                      Prix conseillé (FCFA) (Optionnel)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Ex: 25000"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none transition-all text-ink font-sans"
                    />
                  </div>

                  {/* Ingredients */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                      Ingrédients (Séparés par des virgules) (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Cordyceps, Ginseng, Reishi"
                      value={newProductIngredients}
                      onChange={(e) => setNewProductIngredients(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none transition-all text-ink font-sans"
                    />
                  </div>
                </div>

                {/* How To Use */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                    Conseils d'utilisation (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Prendre une capsule matin et soir après le repas..."
                    value={newProductHowToUse}
                    onChange={(e) => setNewProductHowToUse(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none resize-none transition-all text-ink leading-relaxed font-sans"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-taupe mb-1.5 font-sans">
                    Bienfaits & Avantages (Un par ligne) (Optionnel)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Renforce le système immunitaire&#10;Améliore la vitalité générale&#10;Soutient l'énergie quotidienne"
                    value={newProductBenefits}
                    onChange={(e) => setNewProductBenefits(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-taupe focus:bg-white text-xs py-2.5 px-3.5 rounded-lg outline-none resize-none transition-all text-ink leading-relaxed font-sans"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-md text-[10px] uppercase tracking-wider font-bold border border-stone-200 hover:bg-stone-50 text-stone-500 transition-colors cursor-pointer font-sans"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-ink hover:bg-taupe text-white transition-all shadow-sm cursor-pointer font-sans"
                  >
                    Ajouter le produit
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Passcode Gate Modal */}
      <AnimatePresence>
        {isAdminVerificationOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdminVerificationOpen(false);
                setAdminVerifyInput('');
                setAdminErrorMsg('');
              }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl border border-accent/40 shadow-2xl overflow-hidden relative z-10 p-6 sm:p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-taupe/10 text-taupe flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                
                <h3 className="font-display font-bold text-xl text-ink">Espace Administrateur Sécurisé</h3>
                <p className="text-xs text-taupe/80 mt-1 max-w-xs">
                  Saisissez le code d'accès pour déverrouiller les fonctionnalités de gestion.
                </p>
                
                <form onSubmit={handleVerifyAdminCode} className="w-full mt-6 space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Code d'accès secret"
                      value={adminVerifyInput}
                      onChange={(e) => setAdminVerifyInput(e.target.value)}
                      disabled={!!adminLockoutUntil}
                      className="w-full text-center tracking-widest text-sm py-3 px-4 bg-stone-50 border border-accent/60 rounded-xl focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all text-ink disabled:opacity-50 disabled:bg-stone-100"
                    />
                  </div>

                  {adminErrorMsg && (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs justify-center font-medium">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>
                        {adminErrorMsg}
                        {adminLockoutUntil && lockoutTimeLeft && (
                          <span className="block font-mono text-[10px] mt-1 text-rose-500">
                            Temps restant : {lockoutTimeLeft}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminVerificationOpen(false);
                        setAdminVerifyInput('');
                        setAdminErrorMsg('');
                      }}
                      className="grow bg-white hover:bg-stone-50 text-stone-500 border border-stone-200 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={!!adminLockoutUntil}
                      className="grow bg-ink hover:bg-taupe text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Valider le code
                    </button>
                  </div>
                </form>

                <div className="mt-6 border-t border-stone-100 pt-4 w-full flex items-center justify-between text-[10px] text-stone-400">
                  <span>Tentatives : {adminAttempts} / 5</span>
                  <span>Sécurisé par Orienta TEE 🔒</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Drawer Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
        }}
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
