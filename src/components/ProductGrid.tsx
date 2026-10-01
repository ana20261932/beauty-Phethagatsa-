import React, { useState, useMemo } from 'react';
import { Product, Currency, Category } from '../types/store';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  selectedCategory: Category;
  searchQuery: string;
  onSelectCategory: (cat: Category) => void;
  onSearchChange: (q: string) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  wishlistIds,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'face-care', label: 'Face Care' },
    { id: 'body-care', label: 'Body Care' },
    { id: 'bundles', label: 'Bundles & Kits' },
    { id: 'supplements', label: 'Collagen & Supplements' },
    { id: 'superfood', label: 'Organic Superfoods' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'face-care' && (p.category === 'face-care' || p.category === 'skincare')) {
            // match
          } else if (selectedCategory === 'body-care' && (p.category === 'body-care' || p.category === 'exfoliator')) {
            // match
          } else if (selectedCategory === 'bundles' && (p.category === 'bundles' || p.category === 'skincare-kits')) {
            // match
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }
        // Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchMaterial = p.materials?.toLowerCase().includes(q);
          const matchVendor = p.vendor?.toLowerCase().includes(q);
          const matchType = p.type?.toLowerCase().includes(q);
          const matchSku = p.sku?.toLowerCase().includes(q);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          return matchName || matchTagline || matchMaterial || matchVendor || matchType || matchSku || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <section id="collection-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Section Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold mb-1">
            <span>Phethagatsa Solutions · Modern African Skincare</span>
            <span className="hidden sm:inline text-stone-400">·</span>
            <span className="hidden sm:inline text-stone-500 font-normal">Pure African Botanicals & Eczema Relief</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-950 font-serif">
            Curated South African Skincare & Superfoods
          </h2>
        </div>

        {/* Search inline bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search collagen, scrub, chia, thigh cream..."
            className="w-full bg-white border border-stone-300 rounded-xs py-2 pl-9 pr-8 text-xs font-sans text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Categories & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-stone-100">
        {/* Category Filter Buttons (Functional Buttons, No Static Pills) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-sm">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary controls: In stock toggle & Sort */}
        <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-stone-900 w-3.5 h-3.5 rounded-xs"
            />
            <span className="text-stone-700">In Stock Ready to Ship</span>
          </label>

          <div className="flex items-center gap-1.5 pl-3 border-l border-stone-200">
            <SlidersHorizontal className="w-3 h-3 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-mono text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Sequence</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between py-4 text-xs font-mono text-stone-500">
        <span>
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'curated pieces'}
        </span>
        {searchQuery && (
          <span>
            Filtered by keyword "{searchQuery}"
          </span>
        )}
      </div>

      {/* 3-Column Desktop / 2-Column Tablet Grid with Tactile Image Hover Zoom */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-stone-50/70 border border-dashed border-stone-200 rounded-sm">
          <p className="text-sm font-semibold text-stone-800">No pieces match your current filter parameters.</p>
          <p className="mt-1 text-xs text-stone-500">Try broadening your search term or selecting all categories.</p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-stone-900 border border-stone-300 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer"
          >
            Reset Catalog Filters
          </button>
        </div>
      )}
    </section>
  );
};
