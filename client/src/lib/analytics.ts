// Google Analytics Integration with Web Vitals
// Using GA4 for comprehensive analytics

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Default GA4 Measurement ID (can be overridden by env variable)
const DEFAULT_MEASUREMENT_ID = 'G-MJ10R3CF8F';

// Get the measurement ID from env or use default
const getMeasurementId = (): string => {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID;
};

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = getMeasurementId();

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Check if already initialized
  if (window.gtag) {
    console.log('[GA4] Already initialized');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll send page views manually for SPA
  });

  console.log(`[GA4] Initialized with ID: ${measurementId}`);

  // Initialize Web Vitals reporting
  initWebVitals();
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track events
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track conversions (for affiliate clicks, signups, etc.)
export const trackConversion = (
  conversionType: string,
  value?: number,
  currency?: string,
  transactionId?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency || 'AED',
    transaction_id: transactionId,
  });
};

// Track affiliate link clicks
export const trackAffiliateClick = (
  linkId: string,
  provider: string,
  destination: string,
  contentId?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'affiliate_click', {
    link_id: linkId,
    provider: provider,
    destination: destination,
    content_id: contentId,
    timestamp: new Date().toISOString(),
  });

  // Also send to our backend for tracking
  fetch('/api/affiliate/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      linkId,
      provider,
      destination,
      contentId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }),
  }).catch(console.error);
};

// ============================================================================
// WEB VITALS REPORTING
// ============================================================================

/**
 * Send Web Vitals metrics to GA4
 */
const sendToGA4 = (metric: Metric) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Round values for cleaner reporting
  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);

  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: value,
    non_interaction: true,
    // Custom dimensions for more detailed analysis
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
  });

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
};

/**
 * Initialize Web Vitals reporting
 */
const initWebVitals = () => {
  try {
    // Core Web Vitals
    onCLS(sendToGA4);   // Cumulative Layout Shift
    onINP(sendToGA4);   // Interaction to Next Paint (replaced FID)
    onLCP(sendToGA4);   // Largest Contentful Paint

    // Additional metrics
    onFCP(sendToGA4);   // First Contentful Paint
    onTTFB(sendToGA4);  // Time to First Byte

    console.log('[Web Vitals] Initialized');
  } catch (error) {
    console.error('[Web Vitals] Failed to initialize:', error);
  }
};

/**
 * Manually report a custom performance metric
 */
export const reportCustomMetric = (name: string, value: number, unit?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'custom_metric', {
    event_category: 'Performance',
    metric_name: name,
    metric_value: value,
    metric_unit: unit || 'ms',
  });
};

// ============================================================================
// USER TIMING API HELPERS
// ============================================================================

/**
 * Mark a performance point
 */
export const markPerformance = (name: string) => {
  if (typeof performance !== 'undefined') {
    performance.mark(name);
  }
};

/**
 * Measure between two marks and report to GA4
 */
export const measurePerformance = (name: string, startMark: string, endMark?: string) => {
  if (typeof performance === 'undefined') return;

  try {
    const measureName = `measure_${name}`;
    performance.measure(measureName, startMark, endMark);

    const entries = performance.getEntriesByName(measureName);
    if (entries.length > 0) {
      const duration = entries[0].duration;
      reportCustomMetric(name, duration);
    }
  } catch (error) {
    console.error('[Performance] Measure failed:', error);
  }
};

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track JavaScript errors
 */
export const trackError = (error: Error, context?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: false,
    error_name: error.name,
    error_stack: error.stack?.substring(0, 500), // Limit stack trace length
    ...context,
  });
};

/**
 * Initialize global error handler
 */
export const initErrorTracking = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    trackError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    trackError(error, { type: 'unhandled_promise_rejection' });
  });

  console.log('[Error Tracking] Initialized');
};
