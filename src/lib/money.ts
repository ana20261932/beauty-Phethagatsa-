export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromZAR: number; // 1 ZAR = X target currency
  symbolPlacement: 'before' | 'after';
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  ZAR: {
    code: 'ZAR',
    symbol: 'R ',
    rateFromZAR: 1.0,
    symbolPlacement: 'before',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateFromZAR: 0.055,
    symbolPlacement: 'before',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateFromZAR: 0.051,
    symbolPlacement: 'before',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateFromZAR: 0.043,
    symbolPlacement: 'before',
  },
};

/**
 * Formats an amount given in South African Rand (ZAR) into the chosen currency.
 */
export function formatMoney(amountInZAR: number, currency: CurrencyCode = 'ZAR'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.ZAR;
  const converted = amountInZAR * config.rateFromZAR;

  // Format with thousands separator
  const formattedNumber = Math.round(converted).toLocaleString('en-ZA');

  return `${config.symbol}${formattedNumber}`;
}
