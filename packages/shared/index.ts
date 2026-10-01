// @phethagatsa/shared
// Shared types, WhatsApp URL utilities, and currency helpers

export * from '../../src/types/store';

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateProductWhatsAppUrl(productName: string, price: number, sku?: string): string {
  const phone = '27723819402';
  const text = `Dumela Phethagatsa Solutions! 🇿🇦 I'm interested in ordering "${productName}" (R${price.toFixed(2)}${sku ? ` - SKU: ${sku}` : ''}). Could you please assist me with payment and delivery details?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateSupportWhatsAppUrl(orderNumber?: string): string {
  const phone = '27723819402';
  const text = orderNumber
    ? `Dumela Phethagatsa Support! I have an inquiry regarding my order #${orderNumber}.`
    : `Dumela Phethagatsa Support! I'd like skincare advice or help placing an order.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
