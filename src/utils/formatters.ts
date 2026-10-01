import { Currency, CurrencyConfig } from '../types/store';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  ZAR: { code: 'ZAR', symbol: 'R ', rate: 1.0 },
  USD: { code: 'USD', symbol: '$', rate: 0.055 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.051 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.043 },
};

/**
 * Formats an amount with base price in South African Rand (ZAR)
 */
export function formatPrice(amountInZAR: number, currency: Currency = 'ZAR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.ZAR;
  const converted = amountInZAR * config.rate;
  return `${config.symbol}${Math.round(converted).toLocaleString('en-ZA')}`;
}

export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
