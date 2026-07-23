import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Support base64 image uploads up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read products
function readProducts(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading products file:', e);
  }
  return [];
}

// Helper to write products
function writeProducts(products: any[]): boolean {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing products file:', e);
    return false;
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  if (!newProduct || !newProduct.id) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  const products = readProducts();
  const existingIndex = products.findIndex((p: any) => p.id === newProduct.id);

  if (existingIndex >= 0) {
    products[existingIndex] = newProduct;
  } else {
    products.unshift(newProduct);
  }

  writeProducts(products);
  res.json({ success: true, product: newProduct, total: products.length });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  let products = readProducts();
  const initialLength = products.length;
  products = products.filter((p: any) => p.id !== id);

  writeProducts(products);
  res.json({ success: true, removed: initialLength - products.length });
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
