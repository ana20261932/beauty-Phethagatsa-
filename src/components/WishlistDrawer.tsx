import React from 'react';
import { Product, Currency } from '../types/store';
import { formatPrice } from '../utils/formatters';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistIds: string[];
  allProducts: Product[];
  currency: Currency;
  onClose: () => void;
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistIds,
  allProducts,
  currency,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end"
    >
      <div className="relative w-full max-w-md bg-stone-50 h-full flex flex-col shadow-2xl border-l border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-stone-900 fill-stone-900" />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-stone-950 font-serif">
                Saved Collector Wishlist
              </h2>
              <p className="text-xs font-mono text-stone-500">{savedProducts.length} objects reserved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-2 text-stone-400 hover:text-stone-900 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedProducts.length > 0 ? (
            savedProducts.map((p) => (
              <div key={p.id} className="flex gap-4 p-3 bg-white border border-stone-200 rounded-xs shadow-2xs">
                <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xs" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{p.name}</h4>
                    <p className="text-[11px] font-mono text-stone-500">{p.edition}</p>
                    <div className="text-xs font-mono font-medium text-stone-900 mt-1">
                      {formatPrice(p.price, currency)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onAddToCart(p);
                        onRemoveFromWishlist(p.id);
                      }}
                      className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-mono rounded-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(p.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm font-semibold text-stone-800">Your wishlist is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Save pieces you love while exploring the collection by clicking the heart icon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
