import { Product, Boutique } from './types';

// Helper to remove duplicate products by ID
export function deduplicateProducts(items: Product[]): Product[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// In-memory cache synced with localStorage
let localProducts: Product[] = [];

// Initialize local state from localStorage
const saved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_user_products') : null;
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      localProducts = deduplicateProducts(parsed);
    }
  } catch (e) {
    localProducts = [];
  }
}

let dbInstance: any = null;
let firebaseLoaded = false;

// Initialize Firebase dynamically to prevent compile errors when the config is not yet generated
export async function getDb() {
  if (dbInstance) return dbInstance;
  
  try {
    // Dynamic import to avoid build failures if firebase-applet-config.json is not present yet
    const configModule = await import('./firebase-applet-config.json' as any);
    const firebaseModule = await import('firebase/app');
    const firestoreModule = await import('firebase/firestore');
    
    const firebaseConfig = configModule.default;
    
    const app = !firebaseModule.getApps().length 
      ? firebaseModule.initializeApp(firebaseConfig) 
      : firebaseModule.getApp();
      
    dbInstance = firestoreModule.getFirestore(app, firebaseConfig.firestoreDatabaseId);
    firebaseLoaded = true;
    
    // Validate connection per Firebase Skill requirements
    try {
      await firestoreModule.getDocFromServer(firestoreModule.doc(dbInstance, 'test', 'connection'));
    } catch (e) {
      console.log("Firestore test connection check done.");
    }
    
    return dbInstance;
  } catch (err) {
    // Expected fallback when Firebase is not yet provisioned in the UI
    console.log("Firebase not yet configured. Operating on robust local database.");
    return null;
  }
}

// Helper to convert names to URL slugs
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // separate accents from characters
    .replace(/[\u0300-\u036f]/g, '') // remove accent characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // trim leading hyphens
    .replace(/-+$/, ''); // trim trailing hyphens
}

// Load all products from Server API (with localStorage fallback)
export async function loadProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const uniqueList = deduplicateProducts(data);
        localStorage.setItem('fohowhope_user_products', JSON.stringify(uniqueList));
        localProducts = uniqueList;
        return uniqueList;
      }
    }
  } catch (err) {
    console.warn("Server API fetch failed, trying local storage or Firestore fallback:", err);
  }

  const db = await getDb();
  if (db) {
    try {
      const firestoreModule = await import('firebase/firestore');
      const productsCol = firestoreModule.collection(db, 'products');
      const snapshot = await firestoreModule.getDocs(productsCol);
      const list: Product[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Product);
      });
      const uniqueList = deduplicateProducts(list);
      localStorage.setItem('fohowhope_user_products', JSON.stringify(uniqueList));
      localProducts = uniqueList;
      return uniqueList;
    } catch (err) {
      console.error("Failed to fetch from Firestore:", err);
    }
  }
  
  // Fallback to localProducts from localStorage
  return deduplicateProducts(localProducts);
}

// Save a single product to Server API and local memory
export async function saveProduct(product: Product): Promise<void> {
  // Ensure slugs are defined
  if (!product.productSlug) {
    product.productSlug = slugify(product.name);
  }
  if (!product.sellerSlug) {
    product.sellerSlug = slugify(product.sellerName || 'orienta');
  }
  if (!product.sellerName) {
    product.sellerName = 'Orienta';
  }

  // Update memory list
  const existingIndex = localProducts.findIndex(p => p.id === product.id);
  if (existingIndex >= 0) {
    localProducts[existingIndex] = product;
  } else {
    localProducts.unshift(product);
  }
  
  const uniqueList = deduplicateProducts(localProducts);
  localProducts = uniqueList;
  localStorage.setItem('fohowhope_user_products', JSON.stringify(uniqueList));

  // Sync to Server API
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    console.log(`Product "${product.name}" saved to Server API.`);
  } catch (err) {
    console.error("Failed to save product to Server API:", err);
  }

  // Sync to Firestore if available
  const db = await getDb();
  if (db) {
    try {
      const firestoreModule = await import('firebase/firestore');
      const docRef = firestoreModule.doc(db, 'products', product.id);
      await firestoreModule.setDoc(docRef, product);
    } catch (err) {
      console.error("Failed to save to Firestore:", err);
    }
  }
}

// Delete a single product from Server API
export async function deleteProductFromDb(productId: string): Promise<void> {
  localProducts = localProducts.filter(p => p.id !== productId);
  localStorage.setItem('fohowhope_user_products', JSON.stringify(localProducts));

  // Sync deletion to Server API
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    console.log(`Product "${productId}" deleted from Server API.`);
  } catch (err) {
    console.error("Failed to delete product from Server API:", err);
  }

  const db = await getDb();
  if (db) {
    try {
      const firestoreModule = await import('firebase/firestore');
      const docRef = firestoreModule.doc(db, 'products', productId);
      await firestoreModule.deleteDoc(docRef);
    } catch (err) {
      console.error("Failed to delete from Firestore:", err);
    }
  }
}

// Load all boutiques
export async function loadBoutiques(): Promise<Boutique[]> {
  const localSaved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_boutiques') : null;
  let localBoutiques: Boutique[] = [];
  if (localSaved) {
    try {
      localBoutiques = JSON.parse(localSaved);
    } catch (e) {
      localBoutiques = [];
    }
  }

  const db = await getDb();
  if (db) {
    try {
      const firestoreModule = await import('firebase/firestore');
      const colRef = firestoreModule.collection(db, 'boutiques');
      const snapshot = await firestoreModule.getDocs(colRef);
      const list: Boutique[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Boutique);
      });
      localStorage.setItem('fohowhope_boutiques', JSON.stringify(list));
      return list;
    } catch (err) {
      console.error("Failed to fetch boutiques from Firestore:", err);
    }
  }

  return localBoutiques;
}

// Save a single boutique
export async function saveBoutique(boutique: Boutique): Promise<void> {
  const localSaved = typeof window !== 'undefined' ? localStorage.getItem('fohowhope_boutiques') : null;
  let localBoutiques: Boutique[] = [];
  if (localSaved) {
    try {
      localBoutiques = JSON.parse(localSaved);
    } catch (e) {
      localBoutiques = [];
    }
  }

  const existingIndex = localBoutiques.findIndex(b => b.id === boutique.id || b.sellerSlug === boutique.sellerSlug);
  if (existingIndex >= 0) {
    localBoutiques[existingIndex] = boutique;
  } else {
    localBoutiques.unshift(boutique);
  }
  localStorage.setItem('fohowhope_boutiques', JSON.stringify(localBoutiques));

  const db = await getDb();
  if (db) {
    try {
      const firestoreModule = await import('firebase/firestore');
      const docRef = firestoreModule.doc(db, 'boutiques', boutique.id);
      await firestoreModule.setDoc(docRef, boutique);
      console.log(`Boutique ${boutique.shopName} saved successfully to Firestore!`);
    } catch (err) {
      console.error("Failed to save boutique to Firestore:", err);
    }
  }
}
