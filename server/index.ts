import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, SEED_ORDERS, SEED_CUSTOMER, INITIAL_SETTINGS, INITIAL_ANALYTICS } from '../src/data/initialProducts';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory runtime data cache (seeded from initial South African skincare data)
let productsCache = [...INITIAL_PRODUCTS];
let ordersCache = [...SEED_ORDERS];
let customersCache = [{ ...SEED_CUSTOMER }];
let settingsCache = { ...INITIAL_SETTINGS };
let analyticsCache = { ...INITIAL_ANALYTICS };

// 1. Health check & System Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Phethagatsa Solutions Modern African Skincare API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'Connected (PostgreSQL / MongoDB)' : 'Development In-Memory & LocalStorage Sync',
    environment: process.env.NODE_ENV || 'development',
    counts: {
      products: productsCache.length,
      orders: ordersCache.length,
      customers: customersCache.length,
    },
  });
});

// 2. Product Endpoints
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let result = [...productsCache];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = productsCache.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'New Botanical Formula',
    tagline: req.body.tagline || 'African Botanicals',
    price: Number(req.body.price) || 250,
    category: req.body.category || 'face-care',
    image: req.body.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: req.body.description || '',
    ingredients: req.body.ingredients || 'Organic botanicals',
    howToUse: req.body.howToUse || 'Apply gently twice daily.',
    benefits: req.body.benefits || ['Hydrating', 'Nourishing'],
    stock: Number(req.body.stock) || 50,
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    tags: req.body.tags || ['organic'],
  };
  productsCache.unshift(newProduct as any);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = productsCache.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  productsCache[index] = { ...productsCache[index], ...req.body };
  res.json({ success: true, data: productsCache[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = productsCache.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  const deleted = productsCache.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// 3. Orders Endpoints
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, count: ordersCache.length, data: ordersCache });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder = {
    id: `PS-${Date.now().toString().slice(-5)}`,
    customerName: req.body.customerName || 'Valued Customer',
    customerEmail: req.body.customerEmail || 'customer@example.com',
    customerPhone: req.body.customerPhone || '+27 72 000 0000',
    shippingAddress: req.body.shippingAddress || 'South Africa',
    items: req.body.items || [],
    subtotal: req.body.subtotal || 0,
    shippingCost: req.body.shippingCost || 0,
    discount: req.body.discount || 0,
    total: req.body.total || 0,
    status: 'pending',
    paymentMethod: req.body.paymentMethod || 'instant_eft',
    createdAt: new Date().toISOString(),
    trackingNumber: undefined,
  };
  ordersCache.unshift(newOrder as any);
  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, trackingNumber } = req.body;
  const order = ordersCache.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  if (status) order.status = status;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  res.json({ success: true, data: order });
});

// 4. Analytics & Customers
app.get('/api/analytics', (req: Request, res: Response) => {
  const totalRevenue = ordersCache.reduce((sum, o) => sum + (o.total || 0), 0);
  res.json({
    success: true,
    data: {
      ...analyticsCache,
      totalRevenue: totalRevenue > 0 ? totalRevenue : analyticsCache.totalRevenue,
      totalOrders: ordersCache.length,
      activeCustomers: customersCache.length,
    },
  });
});

app.get('/api/customers', (req: Request, res: Response) => {
  res.json({ success: true, count: customersCache.length, data: customersCache });
});

// 5. Store Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, data: settingsCache });
});

app.put('/api/settings', (req: Request, res: Response) => {
  settingsCache = { ...settingsCache, ...req.body };
  res.json({ success: true, data: settingsCache });
});

// 6. WhatsApp Direct Order Link Generator
app.post('/api/whatsapp/order-link', (req: Request, res: Response) => {
  const { orderId, customerName, totalZAR, items } = req.body;
  const phoneNumber = settingsCache.whatsappNumber || process.env.WHATSAPP_NUMBER || '27723819402';

  let itemsSummary = '';
  if (Array.isArray(items)) {
    itemsSummary = items.map((i: any) => `• ${i.name || i.product?.name} (x${i.quantity || 1}) - R${i.price || i.product?.price}`).join('\n');
  }

  const message = `*Dumela Phethagatsa Solutions!* 🇿🇦\n\nI have placed order *#${orderId || 'NEW'}*\n*Customer:* ${customerName || 'Valued Customer'}\n*Total:* R${totalZAR}\n\n*Items:*\n${itemsSummary}\n\nPlease confirm banking / delivery details. Ke a leboga!`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  res.json({ success: true, url, message });
});

// Start listening if run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VITE) {
  app.listen(PORT, () => {
    console.log(`Phethagatsa Solutions API Server running on port ${PORT}`);
  });
}
