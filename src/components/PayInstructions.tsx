import React, { useState } from 'react';
import { Copy, Check, Landmark, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER, STORE_WHATSAPP_DISPLAY } from '../lib/whatsapp';

interface PayInstructionsProps {
  orderRef: string;
  totalFormatted: string;
  customerName?: string;
  onPaymentSentViaWhatsApp?: () => void;
}

export const PayInstructions: React.FC<PayInstructionsProps> = ({
  orderRef,
  totalFormatted,
  customerName,
  onPaymentSentViaWhatsApp,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bankDetails = [
    { label: 'Bank Name', value: 'Capitec Business / Mercantile Bank' },
    { label: 'Account Holder', value: 'Phethagatsa Solutions (Pty) Ltd' },
    { label: 'Account Number', value: '1051849203' },
    { label: 'Branch Code', value: '470010' },
    { label: 'Account Type', value: 'Business Cheque' },
    { label: 'Payment Reference', value: orderRef },
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const whatsappProofMessage = `*Dumela Phethagatsa Solutions!* 🇿🇦\n\nI have transferred payment for Order Reference *#${orderRef}* (${customerName || 'Valued Customer'}).\n*Amount Paid:* ${totalFormatted}\n*Bank Ref:* ${orderRef}\n\n📎 *Attaching Proof of Payment (POP) screenshot / PDF below.*\nPlease confirm receipt and courier tracking number with The Courier Guy!`;

  const whatsappProofUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappProofMessage)}`;

  return (
    <div className="p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 font-bold text-stone-900 font-sans text-sm">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-800" />
          <span>Offline EFT / Direct Bank Transfer Details</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
          Auto WhatsApp Dispatch
        </span>
      </div>

      <p className="text-stone-600 text-[11px] font-sans leading-relaxed">
        Please make an Electronic Funds Transfer (EFT) of <strong className="text-stone-950 font-mono text-xs">{totalFormatted}</strong> from your banking app (Capitec, FNB, Standard Bank, Nedbank, Absa, or Tymebank) using your reference <strong className="text-amber-900 font-mono">#{orderRef}</strong>.
      </p>

      {/* Account Details Box */}
      <div className="bg-white border border-stone-200 rounded-xs divide-y divide-stone-100 text-xs shadow-2xs">
        {bankDetails.map((b) => (
          <div key={b.label} className="p-2.5 flex items-center justify-between">
            <span className="text-stone-500 text-[11px]">{b.label}</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${b.label === 'Payment Reference' ? 'text-amber-800 font-mono text-sm' : 'text-stone-900'}`}>
                {b.value}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(b.label, b.value)}
                className="text-stone-400 hover:text-stone-900 cursor-pointer p-0.5"
                title={`Copy ${b.label}`}
              >
                {copiedKey === b.label ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Auto Send WhatsApp Proof Banner */}
      <div className="p-3 bg-emerald-950/5 border border-emerald-700/30 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Automatic WhatsApp Payment Verification</span>
          </div>
          <p className="text-[11px] text-stone-600 font-sans mt-0.5">
            Send your proof of payment directly to our concierge at <span className="font-mono font-medium text-emerald-900">{STORE_WHATSAPP_DISPLAY}</span>.
          </p>
        </div>

        <a
          href={whatsappProofUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onPaymentSentViaWhatsApp}
          className="w-full sm:w-auto px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Send POP on WhatsApp</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
