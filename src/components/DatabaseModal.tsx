import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Product, Order, Review, Category } from '../types/store';
import { Database, X, RefreshCw, Download, Upload, Plus, Check, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'reviews' | 'json' | 'add'>('overview');
  const [stats, setStats] = useState(dbService.getDatabaseStats());
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rawJson, setRawJson] = useState('');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(450);
  const [newCategory, setNewCategory] = useState<Category>('face-care');
  const [newStock, setNewStock] = useState(8);
  const [newMaterials, setNewMaterials] = useState('Raw Shea Butter, Cold-Pressed Marula Oil');
  const [newArtisan, setNewArtisan] = useState('Phethagatsa Labs, Pretoria');

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setStats(dbService.getDatabaseStats());
    setProducts(dbService.getProducts());
    setOrders(dbService.getOrders());
    setReviews(dbService.getReviews());
    setRawJson(dbService.exportDatabaseJSON());
  };

  if (!isOpen) return null;

  const handleStockChange = (id: string, currentStock: number, delta: number) => {
    const updated = Math.max(0, currentStock + delta);
    dbService.updateProductStock(id, updated);
    refreshData();
  };

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    dbService.updateOrderStatus(orderId, newStatus);
    refreshData();
  };

  const handleResetDefaults = () => {
    if (confirm('Reset database to default curated catalog? This clears custom orders.')) {
      dbService.resetToDefaults();
      refreshData();
    }
  };

  const handleExportDownload = () => {
    const jsonStr = dbService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-forma-db-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dbService.addCustomProduct({
      name: newTitle.trim(),
      tagline: 'Bespoke sculptural object crafted in limited studio run',
      category: newCategory,
      price: Number(newPrice),
      currency: 'USD',
      image: products[0]?.image || '',
      additionalImages: [],
      description: 'An architectural expression of refined geometry and monolithic natural materials.',
      details: ['Handmade studio original', 'Signed by master artisan', 'Numbered atelier edition'],
      dimensions: 'Custom architectural proportions',
      materials: newMaterials,
      artisan: newArtisan,
      stock: Number(newStock),
      rating: 5.0,
      reviewCount: 1,
      edition: 'Bespoke Run',
      variants: [{ id: 'v-custom-1', name: 'Original Studio Finish', inStock: true }],
    });

    setNewTitle('');
    refreshData();
    setActiveTab('products');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-white border border-stone-200 shadow-2xl rounded-xs overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-800 rounded-xs text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold uppercase tracking-wider text-white font-serif">
                  Free Database Engine Hub
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-xs">
                  Active & Persistent
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-400">
                Zero-cost client persistence engine with real-time reactive sync, transactions, & backup tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xs transition-colors cursor-pointer"
              title="Refresh State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xs transition-colors cursor-pointer"
              aria-label="Close database inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'add' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-3 h-3" />
            <span>Insert Record</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === 'json' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Raw JSON Dump
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs">
                  <div className="text-[11px] font-mono uppercase text-stone-500">Products Catalog</div>
                  <div className="text-2xl font-bold font-mono text-stone-950 mt-1">{stats.totalProducts}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">Live items in store</div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs">
                  <div className="text-[11px] font-mono uppercase text-stone-500">Orders Placed</div>
                  <div className="text-2xl font-bold font-mono text-stone-950 mt-1">{stats.totalOrders}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">Customer manifests</div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs">
                  <div className="text-[11px] font-mono uppercase text-stone-500">Collector Reviews</div>
                  <div className="text-2xl font-bold font-mono text-stone-950 mt-1">{stats.totalReviews}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">Verified appraisals</div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs">
                  <div className="text-[11px] font-mono uppercase text-stone-500">Cart & Wishlist</div>
                  <div className="text-2xl font-bold font-mono text-stone-950 mt-1">
                    {stats.cartItemCount} / {stats.wishlistCount}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">Active session items</div>
                </div>
              </div>

              {/* Architecture & Free Solution Details */}
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-3 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-stone-900 font-serif text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>How This Free Database Architecture Works</span>
                </div>
                <p className="text-stone-700">
                  This e-commerce store is engineered with a **zero-cost, reactive persistent database solution**. It stores all collections—products, live inventory decrements, checkout orders, and customer ratings—locally in permanent browser storage with full cross-tab synchronization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
                  <div className="p-3 bg-white border border-stone-200 rounded-xs">
                    <strong className="text-stone-950 block mb-1">100% Free Forever</strong>
                    No monthly database hosting bills, no unexpected Cloud SQL charges, and zero API limits.
                  </div>
                  <div className="p-3 bg-white border border-stone-200 rounded-xs">
                    <strong className="text-stone-950 block mb-1">Instant Latency (0ms)</strong>
                    All queries, filtering, and mutations execute instantaneously without network lag.
                  </div>
                  <div className="p-3 bg-white border border-stone-200 rounded-xs">
                    <strong className="text-stone-950 block mb-1">Backup & Migration</strong>
                    Export your complete database snapshot as formatted JSON or restore it anytime.
                  </div>
                </div>
              </div>

              {/* Maintenance Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportDownload}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-medium rounded-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Database JSON</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer"
                >
                  Reset To Factory Seed Catalog
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Manage live stock and examine product records in database:</span>
                <span>{products.length} records</span>
              </div>

              <div className="border border-stone-200 rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Live Stock</th>
                      <th className="py-2.5 px-3 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-xs object-cover" />
                            <div>
                              <div className="font-semibold text-stone-900 font-sans">{p.name}</div>
                              <div className="text-[10px] text-stone-400">{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 uppercase text-[11px] text-stone-600">{p.category}</td>
                        <td className="py-3 px-3 font-semibold text-stone-900">${p.price}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                              p.stock > 5 ? 'bg-emerald-50 text-emerald-800' : p.stock > 0 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockChange(p.id, p.stock, -1)}
                              className="px-2 py-0.5 border border-stone-300 hover:bg-stone-100 rounded-xs cursor-pointer text-stone-700"
                              title="Decrease 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleStockChange(p.id, p.stock, 1)}
                              className="px-2 py-0.5 border border-stone-300 hover:bg-stone-100 rounded-xs cursor-pointer text-stone-700"
                              title="Increase 1"
                            >
                              +1
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Orders persisted in database:</span>
                <span>{orders.length} total</span>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xs text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">#{ord.id}</span>
                          <span className="text-stone-500 font-mono">· {new Date(ord.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-stone-950">${ord.total}</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value as any)}
                            className="bg-white border border-stone-300 rounded-xs px-2 py-1 text-[11px] text-stone-900 focus:outline-none cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="crafting">In Atelier</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-stone-600">
                        <div>
                          <strong>Collector:</strong> {ord.customer.fullName} ({ord.customer.email})<br />
                          <strong>Ship To:</strong> {ord.customer.address}, {ord.customer.city}
                        </div>
                        <div>
                          <strong>Payment:</strong> {ord.paymentMethod.toUpperCase()}<br />
                          <strong>Items:</strong> {ord.items.map((i) => `${i.product.name} (×${i.quantity})`).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xs">
                  <p className="text-xs text-stone-600 font-mono">No customer orders placed yet.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Complete a test checkout to see orders stored in real time.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Verified ratings and collector appraisals:</span>
                <span>{reviews.length} reviews</span>
              </div>

              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-stone-900">{rev.author}</span>
                      <span className="text-amber-600 font-mono">{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>
                    <div className="mt-1 text-[10px] font-mono text-stone-400">
                      Product Ref: {rev.productId} · {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INSERT RECORD */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} className="max-w-xl space-y-4 text-xs">
              <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-xs text-stone-700 text-[11px]">
                Test inserting a new custom product directly into the live catalog database.
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-700 mb-1">Object Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sfera Cast Bronze Candelabra"
                  className="w-full bg-white border border-stone-300 rounded-xs px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xs px-2.5 py-2 text-stone-900 focus:outline-none"
                  >
                    <option value="apparel">Apparel</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="headwear">Headwear</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xs px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xs px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-700 mb-1">Materials</label>
                  <input
                    type="text"
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xs px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-700 mb-1">Atelier Provenance</label>
                  <input
                    type="text"
                    value={newArtisan}
                    onChange={(e) => setNewArtisan(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xs px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Save Record to Database
              </button>
            </form>
          )}

          {/* TAB 6: RAW JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Complete database serialized representation:</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(rawJson);
                    alert('Database JSON copied to clipboard!');
                  }}
                  className="underline hover:text-stone-900 cursor-pointer"
                >
                  Copy JSON
                </button>
              </div>
              <textarea
                readOnly
                value={rawJson}
                rows={16}
                className="w-full bg-stone-900 text-stone-200 font-mono text-[11px] p-4 rounded-xs border border-stone-700 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-500">
          <span>Engine: {stats.engine}</span>
          <span>Footprint: ~{Math.round(stats.estimatedSizeBytes / 1024)} KB · All writes committed instantly</span>
        </div>
      </div>
    </div>
  );
};
