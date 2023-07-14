/**
 * Format a price to a string
 * @param price
 * @param currency
 */
export function formatPrice(price, currency = '€') {
  return `${price.toFixed(2)} ${currency}`;
}