import React from 'react';
import { Product, Currency } from '../types/store';
import { formatPrice } from '../utils/formatters';
import { Star, Plus } from 'lucide-react';

interface RelatedProductsProps {
  relatedProducts: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
            Architectural Curations
          </div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-950 font-serif">
            Complementary Botanical Formulations & Rituals
          </h3>
        </div>
        <span className="text-xs font-mono text-stone-500">
          {relatedProducts.length} suggestions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {relatedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="group relative bg-stone-50/60 border border-stone-200 hover:border-stone-400 rounded-xs p-2.5 flex flex-col justify-between transition-all cursor-pointer hover:shadow-xs"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full bg-stone-100 rounded-xs overflow-hidden mb-2.5">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1.5 left-1.5 text-[9px] font-mono bg-white/90 px-1.5 py-0.5 rounded-xs text-stone-700 uppercase">
                  {p.category}
                </span>
              </div>

              {/* Title & Material */}
              <h4 className="text-xs font-semibold text-stone-900 group-hover:text-stone-700 line-clamp-1">
                {p.name}
              </h4>
              <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-mono">
                {p.materials}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-200/70 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-stone-950">
                {formatPrice(p.price, currency)}
              </span>

              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500 text-[10px] font-mono">
                  <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                  <span>{p.rating}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(p);
                  }}
                  title="Quick Add to Bag"
                  className="p-1 rounded-xs bg-stone-200 hover:bg-stone-900 hover:text-white text-stone-700 transition-colors ml-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
