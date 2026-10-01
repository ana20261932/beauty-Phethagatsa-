import React from 'react';
import { HERO_RADIANT_MODEL_IMAGE, BRAND_LOGO_IMAGE } from '../data/initialProducts';
import { ArrowDown, MessageCircle, Sparkles, ShieldCheck, Heart, Truck, CheckCircle2, Leaf } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenQuickView?: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenQuickView }) => {
  const whatsappUrl = `https://wa.me/27723819402?text=${encodeURIComponent(
    'Dumela Phethagatsa Solutions! 🇿🇦 I would like skincare advice or help choosing the best natural products for my skin.'
  )}`;

  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] text-stone-900">
      {/* Hero Banner Grid (Matches Mockup Screen 1 & Mobile Screen 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Copy & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>Modern African Skincare & Eczema Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 font-serif leading-[1.1] [text-wrap:balance]">
              Natural Skincare for Real Results
            </h1>

            <p className="text-base sm:text-lg text-stone-700 font-sans leading-relaxed max-w-xl">
              Premium, natural & effective skincare products for healthy, radiant skin. Handcrafted in South Africa with cold-pressed Marula, unrefined Cape shea butter, and pediatrician-approved botanical actives.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-[#1f3d2e] hover:bg-[#152c21] text-white rounded-xs text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white hover:bg-stone-100 text-emerald-900 border-2 border-emerald-800/40 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-2xs cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Order via WhatsApp</span>
              </a>
            </div>

            {/* Inset Featured Benefit line */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Free doorstep courier nationwide on all orders over R450</span>
            </div>
          </div>

          {/* Right Column: Radiant Melanin Skin Beauty Campaign (Screen 1 & 3) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                <img
                  src={HERO_RADIANT_MODEL_IMAGE}
                  alt="Radiant South African model with glowing natural skin using Phethagatsa Solutions botanical skincare"
                  className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.02] hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Signature Tag (Matches Acacia Logo in Mockup) */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-stone-200/80 flex items-center gap-2.5">
                <img
                  src={BRAND_LOGO_IMAGE}
                  alt="Phethagatsa Logo"
                  className="w-10 h-10 rounded-lg object-contain bg-white"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-stone-900 font-serif leading-none">
                    Phethagatsa Solutions
                  </div>
                  <div className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider mt-1">
                    Natural Beauty · Healthy Skin
                  </div>
                </div>
              </div>

              {/* Bottom Badge Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-950/80 backdrop-blur-md rounded-xl p-3 text-white flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Clinically Formulated in Pretoria & Joburg</span>
                </div>
                <span className="text-amber-300 font-semibold">★ 4.9 / 5.0 (500+ Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Provenance Trust Badges (Matches Mockup Screen 1) */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 flex items-center gap-3.5 shadow-2xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-950 font-serif">100% Natural</div>
              <div className="text-[11px] text-stone-500 font-sans">Active cold-pressed botanicals</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 flex items-center gap-3.5 shadow-2xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-950 font-serif">Cruelty Free</div>
              <div className="text-[11px] text-stone-500 font-sans">Never tested on animals</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 flex items-center gap-3.5 shadow-2xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-950 font-serif">Skin Tested</div>
              <div className="text-[11px] text-stone-500 font-sans">Pediatrician & derm approved</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 flex items-center gap-3.5 shadow-2xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-950 font-serif">Fast Delivery (SA)</div>
              <div className="text-[11px] text-stone-500 font-sans">Doorstep courier nationwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
