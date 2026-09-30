import type { Currency } from '../types/index.js';

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const rounded = Math.round(amount || 0);
  switch (currency) {
    case 'USD':
      return `$${rounded.toLocaleString('en-US')}`;
    case 'EUR':
      return `€${rounded.toLocaleString('de-DE')}`;
    case 'GBP':
      return `£${rounded.toLocaleString('en-GB')}`;
    case 'INR':
    default:
      return `₹${rounded.toLocaleString('en-IN')}`;
  }
}

export function getCurrencySymbol(currency: Currency = 'INR'): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
    default:
      return '₹';
  }
}
