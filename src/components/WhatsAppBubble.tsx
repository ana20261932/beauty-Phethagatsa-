import React, { useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types/store';
import { getOrderWhatsAppUrl } from '../lib/whatsapp';

interface WhatsAppBubbleProps {
  cart: CartItem[];
  cartTotalZAR: number;
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({ cart, cartTotalZAR }) => {
  const [isOpen, setIsOpen] = useState(false);

  const directCartOrderUrl = getOrderWhatsAppUrl(cart, cartTotalZAR);
  const generalChatUrl = `https://wa.me/27723819402?text=${encodeURIComponent(
    'Dumela Phethagatsa Store! I have a question about your collection.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Quick Action Flyout */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white border border-stone-200 rounded-sm shadow-xl p-4 text-xs font-sans animate-fadeIn">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-stone-900 font-serif">
                Phethagatsa WhatsApp
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
            Dumela! Need sizing advice or prefer ordering directly via WhatsApp with EFT or Cash on Delivery?
          </p>

          <div className="mt-3.5 space-y-2">
            {cart.length > 0 && (
              <a
                href={directCartOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Send Bag to WhatsApp ({cart.length})</span>
              </a>
            )}

            <a
              href={generalChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
            >
              <Send className="w-3 h-3 text-stone-600" />
              <span>Chat with Concierge</span>
            </a>
          </div>

          <div className="text-[10px] font-mono text-stone-400 text-center mt-2.5">
            Typical reply time: ~5 mins · Mon-Sat
          </div>
        </div>
      )}

      {/* Primary Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline text-xs font-mono font-medium tracking-wide">
          {isOpen ? 'Close' : 'WhatsApp Us'}
        </span>
      </button>
    </div>
  );
};
