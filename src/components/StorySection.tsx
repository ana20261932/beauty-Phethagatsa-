import React from 'react';
import { MOTHER_CHILD_ECZEMA_IMAGE, ECZEMA_BALM_IMAGE } from '../data/initialProducts';
import { ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface StorySectionProps {
  onOpenProduct?: (productId: string) => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onOpenProduct }) => {
  return (
    <section id="craftsmanship-story" className="border-t border-emerald-900/10 bg-[#f7f5f0] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Story Featuring Mother Treating Child's Eczema */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={MOTHER_CHILD_ECZEMA_IMAGE}
                  alt="Black South African mother tenderly treating her child's sensitive skin and eczema with Phethagatsa Solutions botanical balm"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/90 text-emerald-100 text-[11px] font-mono tracking-wider backdrop-blur-xs">
                      <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
                      Steroid-Free Mother & Child Care
                    </span>
                    <p className="text-xs font-sans text-stone-200 mt-1 font-medium">
                      Johannesburg Clinic Testimonial · Visible Calm in 48 Hours
                    </p>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-mono">
                    Pediatrician Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Inset Product Proof Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 rounded-xl overflow-hidden border border-emerald-900/10 bg-white p-2 flex items-center gap-2.5 shadow-xs">
                <img
                  src={ECZEMA_BALM_IMAGE}
                  alt="Phethagatsa Solutions Soothing Eczema Barrier Balm"
                  className="w-14 h-14 rounded-lg object-cover border border-stone-200/80 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">Formula Nº 07</span>
                  <p className="text-xs font-bold text-stone-900 leading-tight">Eczema Barrier Balm</p>
                  <span className="text-[11px] text-gold-accent font-semibold font-mono">R 95.00</span>
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-emerald-900/10 bg-emerald-50/70 p-3.5 flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>0% Cortisone & 0% Artificial Fragrance</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 font-sans">
                    Formulated with raw African shea butter, Cape Chamomile & colloidal oat.
                  </p>
                </div>
                {onOpenProduct && (
                  <button
                    onClick={() => onOpenProduct('soothing-eczema-barrier-balm')}
                    className="ml-2 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-medium shrink-0 transition-colors shadow-xs cursor-pointer"
                  >
                    Examine
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Empathic Brand Narrative */}
          <div className="lg:col-span-6 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold mb-3 bg-emerald-100/60 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>Modern African Skincare & Eczema Solutions</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-serif leading-[1.15]">
              Gentle, trusted relief for sensitive skin and childhood eczema.
            </h2>

            <p className="mt-5 text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              Nothing is more distressing for a mother than watching her child suffer from inflamed, itchy eczema flare-ups. Traditional cortisone creams can thin delicate melanin-rich skin over time. 
              <strong className="text-stone-950 font-semibold"> Phethagatsa Solutions</strong> was engineered to deliver fast, steroid-free botanical soothing: uniting cold-pressed African shea butter, Kalahari melon oil, and colloidal oat to heal and seal fragile skin barriers safely.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-stone-300/70 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-sm font-serif">01. Safe for Newborns & Kids</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-sans text-[12px]">
                  Zero hydroquinone, zero steroids, zero stinging alcohol. Clinically hypoallergenic for melanin-rich and hyper-reactive baby skin.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold">
                  <Sparkles className="w-4 h-4 text-gold-accent" />
                  <span className="text-sm font-serif">02. 48-Hour Visible Calm</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-sans text-[12px]">
                  Colloidal oat and pure Rooibos bioflavonoids stop nighttime itching within minutes so your family can sleep in calm comfort.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-emerald-900/15 rounded-xl text-xs font-mono text-stone-700 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-semibold text-stone-900">Over 1,200 South African Families Relieved</span>
              </div>
              <span className="text-emerald-800 font-bold">The Courier Guy Doorstep Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
