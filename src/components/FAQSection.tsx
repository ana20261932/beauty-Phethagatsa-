import React, { useState, useMemo } from 'react';
import {
  Truck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'shipping' | 'returns' | 'care' | 'payment';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FAQItem[] = [
  // Shipping & Delivery
  {
    id: 'ship-1',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'How long does door-to-door delivery take across South Africa?',
    answer:
      'Orders dispatched from our Johannesburg fulfillment facility are delivered within 24–48 hours across Gauteng (Johannesburg, Pretoria, Centurion). Deliveries to Western Cape, KwaZulu-Natal, Eastern Cape, and major metropolitan centres take 2–3 business days. Regional and outlying farm addresses take 3–5 business days.',
    highlights: ['Gauteng: 1–2 Business Days', 'Major Metros (Cape Town, Durban): 2–3 Days', 'Outlying: 3–5 Days'],
  },
  {
    id: 'ship-2',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'What are the delivery fees and when do I qualify for free shipping?',
    answer:
      'We offer complimentary door-to-door courier on all orders over R450 across all 9 provinces in South Africa. For orders under R450, a flat standard courier rate of R75 applies nationwide via our verified logistics partners (The Courier Guy and RAM Express).',
    highlights: ['Free delivery on orders over R450', 'Flat R75 courier for smaller orders', 'Doorstep signature tracking included'],
  },
  {
    id: 'ship-3',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'How do I track my order once it has been placed?',
    answer:
      'The moment your order is packed and assigned a courier waybill, you receive an automated tracking notification via SMS and WhatsApp. You can also track your live shipment anytime right here on our site using the "Track Order" button in the navigation or footer.',
    highlights: ['Live SMS & WhatsApp waybill notifications', 'Real-time database lookup via our site header'],
  },

  // Returns & Exchanges
  {
    id: 'ret-1',
    category: 'returns',
    categoryLabel: 'Returns & Guarantees',
    question: 'What is your 30-day gentle skin satisfaction policy?',
    answer:
      'Because sensitive skin and eczema require gentle compatibility, we stand behind our botanical formulas. If your skin experiences unexpected irritation or you are unsatisfied with your product within 30 days of receipt, contact our care concierge for a replacement, exchange, or store credit.',
    highlights: ['30-day satisfaction reassurance', 'Personal consultation with botanical care team'],
  },
  {
    id: 'ret-2',
    category: 'returns',
    categoryLabel: 'Returns & Guarantees',
    question: 'Can I return unopened wellness products or supplements?',
    answer:
      'Yes. Unopened items with intact safety hygiene seals (such as our Collagen Peptides powder, Radiant Skin Gummies, or sealed skincare tubs) can be returned within 14 days of receipt for a full refund back to your original payment method.',
    highlights: ['14-day return window for sealed products', 'Hassle-free collection arranged from your door'],
  },
  {
    id: 'ret-3',
    category: 'returns',
    categoryLabel: 'Returns & Guarantees',
    question: 'What if my package arrives damaged or leaking in transit?',
    answer:
      'We pack all glass jars, pump bottles, and botanical canisters with eco-friendly protective cushioning. In the rare event of transit damage, simply take a quick photo and WhatsApp our support line at +27 72 381 9402 within 48 hours. We will immediately dispatch a priority replacement at no cost to you.',
    highlights: ['Zero-friction replacement for transit damage', 'Priority dispatch within 24 hours'],
  },

  // Product Care & Botanical Usage
  {
    id: 'care-1',
    category: 'care',
    categoryLabel: 'Product Care',
    question: 'How should I store pure collagen peptides and organic chia seeds?',
    answer:
      'Store your superfoods and powdered peptides in a cool, dry pantry away from direct sunlight, steam, and excessive kitchen heat. Always reseal the airtight zip pouch firmly after each scoop to protect against humidity and preserve optimal enzymatic potency.',
    highlights: ['Keep sealed in a cool, dry cupboard', 'Avoid steamy areas and direct sunlight', 'Best consumed within 12 months of opening'],
  },
  {
    id: 'care-2',
    category: 'care',
    categoryLabel: 'Product Care',
    question: 'How should I store and care for botanical skincare & eczema balms?',
    answer:
      'Our formulations use virgin cold-pressed oils, unrefined shea butter, and pure Cape botanicals without synthetic harsh stabilizers. Store between 15°C and 25°C. During extreme South African summer heatwaves, balms may soften naturally—simply place in a cool shaded room or refrigerator for 20 minutes to restore firmness.',
    highlights: ['Pure cold-pressed botanicals without harsh fillers', 'Naturally responds to room temperature', 'Use clean, dry hands to scoop'],
  },
  {
    id: 'care-3',
    category: 'care',
    categoryLabel: 'Product Care',
    question: 'Is a patch test recommended before applying targeted skincare?',
    answer:
      'Yes, we always recommend patch-testing any new formulation, particularly for babies, children with atopic eczema, or highly reactive skin. Apply a pea-sized amount onto the inner wrist or forearm and wait 24 hours. If no redness occurs, proceed with confidence.',
    highlights: ['Recommended for children & reactive skin', 'Test on inner forearm for 24 hours'],
  },

  // Ordering & Payments
  {
    id: 'pay-1',
    category: 'payment',
    categoryLabel: 'Ordering & Payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major South African payment options: Visa and Mastercard credit/debit cards, Instant EFT via Ozow/Capitec/FNB/Nedbank/Standard Bank, PayFast, and verified Cash on Delivery (COD) for qualified Gauteng delivery zones.',
    highlights: ['Instant EFT (Capitec, FNB, Standard Bank, etc.)', 'Visa / Mastercard secure debit & credit', 'WhatsApp direct concierge ordering'],
  },
  {
    id: 'pay-2',
    category: 'payment',
    categoryLabel: 'Ordering & Payment',
    question: 'Can I order directly over WhatsApp?',
    answer:
      'Absolutely! Many of our loyal customers prefer ordering directly with our concierge team over WhatsApp. Simply click the green WhatsApp button, share your delivery address and desired products, and we will send you an official order reference with easy payment instructions.',
    highlights: ['Direct chat with local skincare advisors', 'Manual invoice and EFT support over chat'],
  },
];

type CategoryFilter = 'all' | 'shipping' | 'returns' | 'care' | 'payment';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('ship-1');

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.highlights?.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq-section" className="border-t border-stone-200/80 bg-[#faf8f5] py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold mb-3 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-200/60">
            <HelpCircle className="w-3.5 h-3.5 text-gold-accent" />
            <span>Customer Care & Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Everything you need to know about our South African doorstep shipping, 30-day gentle care policy, and botanical storage practices.
          </p>

          {/* Quick Search */}
          <div className="relative mt-6 max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shipping, returns, balm care, EFT..."
              className="w-full bg-white border border-stone-300 rounded-full py-2.5 pl-10 pr-4 text-xs font-sans text-stone-900 placeholder-stone-400 shadow-2xs focus:outline-none focus:border-emerald-700 transition-colors"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            All Questions ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('shipping')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
              activeCategory === 'shipping'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping & Courier</span>
          </button>
          <button
            onClick={() => setActiveCategory('returns')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
              activeCategory === 'returns'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Returns & Guarantees</span>
          </button>
          <button
            onClick={() => setActiveCategory('care')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
              activeCategory === 'care'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Care & Storage</span>
          </button>
          <button
            onClick={() => setActiveCategory('payment')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
              activeCategory === 'payment'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & WhatsApp</span>
          </button>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xs transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-emerald-800/40 shadow-sm ring-1 ring-emerald-800/10'
                      : 'border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold inline-block">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-stone-950 font-serif leading-snug">
                        {item.question}
                      </h3>
                    </div>
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'bg-emerald-800 text-white rotate-180 border-emerald-800' : 'bg-stone-50 text-stone-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm text-stone-700 leading-relaxed font-sans border-t border-stone-100">
                      <p>{item.answer}</p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap gap-2">
                          {item.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-emerald-50 text-emerald-900 border border-emerald-200/60 text-xs font-mono"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white border border-dashed border-stone-300 rounded-xs">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">No questions matched "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-xs font-mono text-emerald-800 hover:underline cursor-pointer"
              >
                Reset search filter
              </button>
            </div>
          )}
        </div>

        {/* Bottom Concierge Assistance Card */}
        <div className="mt-12 max-w-4xl mx-auto rounded-xs bg-stone-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-amber-300">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Have an unlisted question?</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold font-serif">
              Speak directly with our Johannesburg Botanical Team
            </h4>
            <p className="text-xs text-stone-400 font-sans max-w-md">
              Our registered pharmacists and skincare specialists are available on WhatsApp Monday through Saturday, 08:00–18:00 SAST.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/27723819402?text=Hello%20Phethagatsa%20Solutions!%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium tracking-wide uppercase transition-colors shadow-xs cursor-pointer font-mono"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
            <a
              href="mailto:care@phethagatsa.co.za"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium tracking-wide uppercase transition-colors border border-stone-700 cursor-pointer font-mono"
            >
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
