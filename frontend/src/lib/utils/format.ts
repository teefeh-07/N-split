// Formatting Utilities

export function truncateAddress(address: string, start = 6, end = 4) {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatTokenAmount(amount: number, decimals = 6) {
  return (amount / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: decimals });
}

export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
