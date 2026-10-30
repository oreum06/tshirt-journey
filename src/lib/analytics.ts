// GA4 이벤트 래퍼 (F-14). VITE_GA_ID가 없으면 아무것도 보내지 않는다.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const sent = new Set<string>();

export function initAnalytics() {
  if (!GA_ID || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

type EventName = 'chapter_view' | 'ending_choice' | 'receipt_share' | 'cta_click';

export function track(name: EventName, params: Record<string, string | number> = {}) {
  if (import.meta.env.DEV) console.debug('[analytics]', name, params);
  window.gtag?.('event', name, params);
}

/** 같은 키는 세션당 한 번만 */
export function trackOnce(key: string, name: EventName, params: Record<string, string | number> = {}) {
  if (sent.has(key)) return;
  sent.add(key);
  track(name, params);
}
