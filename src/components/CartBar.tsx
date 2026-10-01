import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Currency } from '../types/store';
import { formatMoney } from '../lib/money';

interface CartBarProps {
  cart: CartItem[];
  currency: Currency;
  onOpenCart: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({ cart, currency, onOpenCart }) => {
  if (cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmountZAR = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <aside
      aria-label="Mobile cart quick bar"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-stone-950/95 text-white border-t border-stone-800 backdrop-blur-md px-4 py-2.5 shadow-xl animate-slideUp"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="relative p-1.5 bg-stone-800 rounded-full">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-stone-950 rounded-full text-[10px] font-mono font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <div className="text-[10px] font-mono text-stone-400 uppercase">Subtotal</div>
            <div className="font-mono text-xs font-bold text-white">
              {formatMoney(totalAmountZAR, currency as any)}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-950 text-xs font-medium uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>View Bag</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
