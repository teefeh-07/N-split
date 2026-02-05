// Analytics Service

type EventName = 
  | 'wallet_connect'
  | 'wallet_disconnect'
  | 'nft_mint'
  | 'nft_buy'
  | 'nft_list'
  | 'stake'
  | 'unstake'
  | 'token_create'
  | 'service_register'
  | 'service_pay';

export function trackEvent(event: EventName, properties?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  // Log locally in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
    return;
  }

  // Send to analytics service in production
  // Example: window.gtag?.('event', event, properties);
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page View:', path);
    return;
  }

  // Example: window.gtag?.('config', 'GA_ID', { page_path: path });
}
