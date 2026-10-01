import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, Currency } from '../types/store';
import { formatPrice } from '../utils/formatters';
import {
  Search,
  X,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Tag,
  Trash2,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { getRecentViewIds, addRecentView, clearRecentViews } from '../services/recentViews';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  currency: Currency;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  currency,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent views when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecentIds(getRecentViewIds());
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setSelectedTag(null);
      setSelectedCategory(null);
    }
  }, [isOpen]);

  // Compute dynamically trending search tags based on actual product catalog tags & frequency
  const trendingTags = useMemo(() => {
    const tagCountMap: Record<string, number> = {};

    products.forEach((product) => {
      // Collect product tags
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((t) => {
          const clean = t.trim().toLowerCase();
          if (clean && clean.length > 2) {
            tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
          }
        });
      }
      // Also collect key benefits as searchable tags
      if (product.benefits && Array.isArray(product.benefits)) {
        product.benefits.forEach((b) => {
          const clean = b.trim().toLowerCase();
          if (clean && clean.length > 2) {
            tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
          }
        });
      }
    });

    // Sort by popularity / count
    return Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [products]);

  // Quick categories with product counts
  const quickCategories = useMemo(() => {
    const categoryMap: Record<string, { label: string; count: number }> = {
      'face-care': { label: 'Face Care', count: 0 },
      'body-care': { label: 'Body Care', count: 0 },
      'bundles': { label: 'Ritual Bundles', count: 0 },
      'supplements': { label: 'Nutricosmetics', count: 0 },
      'superfood': { label: 'Superfoods', count: 0 },
    };

    products.forEach((p) => {
      if (categoryMap[p.category]) {
        categoryMap[p.category].count += 1;
      } else if (p.category === 'skincare' && categoryMap['face-care']) {
        categoryMap['face-care'].count += 1;
      } else if (p.category === 'skincare-kits' && categoryMap['bundles']) {
        categoryMap['bundles'].count += 1;
      } else if (p.category === 'exfoliator' && categoryMap['body-care']) {
        categoryMap['body-care'].count += 1;
      }
    });

    return Object.entries(categoryMap).map(([id, info]) => ({
      id,
      label: info.label,
      count: info.count,
    }));
  }, [products]);

  // Recently viewed products list
  const recentProducts = useMemo(() => {
    return recentIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentIds, products]);

  // Handle product click
  const handleProductClick = (product: Product) => {
    addRecentView(product.id);
    setRecentIds(getRecentViewIds());
    onSelectProduct(product);
    onClose();
  };

  const handleClearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentViews();
    setRecentIds([]);
  };

  // Filter products by query, selected tag, or category
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products.filter((p) => {
      // Category filter
      if (selectedCategory) {
        const matchesCategory =
          p.category === selectedCategory ||
          (selectedCategory === 'face-care' && p.category === 'skincare') ||
          (selectedCategory === 'bundles' && p.category === 'skincare-kits') ||
          (selectedCategory === 'body-care' && p.category === 'exfoliator');
        if (!matchesCategory) return false;
      }

      // Tag filter
      if (selectedTag) {
        const hasTag =
          p.tags?.some((t) => t.toLowerCase() === selectedTag) ||
          p.benefits?.some((b) => b.toLowerCase().includes(selectedTag));
        if (!hasTag) return false;
      }

      // Query filter
      if (!q) return Boolean(selectedTag || selectedCategory);

      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.benefits?.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [products, query, selectedTag, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 sm:pt-14 animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-emerald-800 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedTag) setSelectedTag(null);
            }}
            placeholder="Search glowing skin, collagen, baobab, face cream, eczema balm..."
            className="flex-1 bg-transparent text-sm sm:text-base font-sans text-stone-950 placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedTag(null);
                setSelectedCategory(null);
              }}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-950 px-2.5 py-1 bg-stone-200/60 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Dynamic Filters & Tag Bar */}
        <div className="px-4 py-3 bg-stone-100/70 border-b border-stone-200/80 space-y-2.5">
          {/* Quick Categories Section */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 shrink-0 flex items-center gap-1 font-semibold">
              <SlidersHorizontal className="w-3 h-3 text-emerald-700" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                selectedCategory === null
                  ? 'bg-stone-900 text-white font-medium shadow-2xs'
                  : 'bg-white hover:bg-stone-200/80 text-stone-700 border border-stone-200'
              }`}
            >
              All ({products.length})
            </button>
            {quickCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white font-medium shadow-2xs'
                    : 'bg-white hover:bg-stone-200/80 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] ${selectedCategory === cat.id ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Real-Time Dynamic Trending Searches (Aggregated from product tags) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 shrink-0 flex items-center gap-1 font-semibold">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" /> Trending:
            </span>
            {trendingTags.map(({ tag, count }) => {
              const isSelected = selectedTag === tag || query.toLowerCase() === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTag === tag) {
                      setSelectedTag(null);
                      setQuery('');
                    } else {
                      setSelectedTag(tag);
                      setQuery(tag);
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-2xs'
                      : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200/70'
                  }`}
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  <span className="capitalize">{tag}</span>
                  <span className={`text-[9px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: Left = Live Results / Suggestions, Right = Recently Viewed Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-stone-200 min-h-0">
          {/* Main Results Column (8 cols on desktop) */}
          <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[55vh]">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                <span className="text-xs font-mono font-semibold text-stone-700">
                  {query || selectedTag || selectedCategory
                    ? `Results (${filteredProducts.length})`
                    : 'Curated Catalog Highlights'}
                </span>
                {(query || selectedTag || selectedCategory) && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedTag(null);
                      setSelectedCategory(null);
                    }}
                    className="text-[11px] text-emerald-800 hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Product Cards List */}
              <div className="space-y-2">
                {(query || selectedTag || selectedCategory ? filteredProducts : products.slice(0, 5)).map(
                  (product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full p-2.5 rounded-lg border border-stone-200/80 hover:border-emerald-700/50 hover:bg-emerald-50/20 flex items-center justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover border border-stone-100 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-950 flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.stock <= 5 && product.stock > 0 && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">
                                Low Stock
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">
                            {product.tagline}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-stone-100 rounded text-stone-600">
                              {product.category}
                            </span>
                            {product.benefits?.slice(0, 2).map((b) => (
                              <span
                                key={b}
                                className="text-[10px] text-emerald-800 font-mono hidden sm:inline"
                              >
                                · {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-xs font-mono font-bold text-stone-900">
                          {formatPrice(product.price, currency)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  )
                )}

                {/* Empty State */}
                {(query || selectedTag || selectedCategory) && filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-xs text-stone-500">
                    <p className="font-semibold text-stone-800">No botanical formulas matched your search.</p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Try searching for "Glow", "Face Cream", "Serum", "Baobab", or tap a trending tag above.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Hint footer */}
            <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>Press ESC to close</span>
              <span>South African Rand (ZAR)</span>
            </div>
          </div>

          {/* Recently Viewed Sidebar (4 cols on desktop) */}
          <div className="md:col-span-4 p-4 sm:p-5 bg-stone-50/60 flex flex-col justify-between overflow-y-auto max-h-[55vh]">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                <span className="text-xs font-mono font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  Recently Viewed
                </span>
                {recentProducts.length > 0 && (
                  <button
                    onClick={handleClearRecents}
                    className="text-[10px] font-mono text-stone-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Clear recently viewed products"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Recent Items List */}
              {recentProducts.length > 0 ? (
                <div className="space-y-2">
                  {recentProducts.map((product) => (
                    <button
                      key={`recent-${product.id}`}
                      onClick={() => handleProductClick(product)}
                      className="w-full p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-700/60 hover:shadow-2xs flex items-center gap-2.5 text-left transition-all cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-stone-900 truncate group-hover:text-emerald-900">
                          {product.name}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500">
                          {formatPrice(product.price, currency)}
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-stone-400 text-xs space-y-1.5">
                  <Sparkles className="w-5 h-5 mx-auto text-stone-300" />
                  <p className="font-semibold text-stone-600 text-[11px]">No Recent Views Yet</p>
                  <p className="text-[10px] text-stone-400 leading-relaxed px-2">
                    Formulas you browse on the storefront will appear here for fast one-tap re-ordering.
                  </p>
                </div>
              )}
            </div>

            {/* Quick WhatsApp Support Shortcut */}
            <div className="mt-4 pt-3 border-t border-stone-200 text-center">
              <a
                href="https://wa.me/27829564472?text=Dumela%20Phethagatsa%20Solutions!%20I%20am%20looking%20for%20a%20recommendation."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1"
              >
                <span>Need advice? Chat on WhatsApp</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
