import { onCLS, onINP, onLCP } from 'web-vitals'

export function registerWebVitals() {
  onLCP((metric) => {
    console.log('LCP:', metric.value, 'ms', 'Target: <2500ms')
    sendToAnalytics(metric)
  })

  onINP((metric) => {
    console.log('INP:', metric.value, 'ms', 'Target: <200ms')
    sendToAnalytics(metric)
  })

  onCLS((metric) => {
    console.log('CLS:', metric.value, 'Target: <0.1')
    sendToAnalytics(metric)
  })
}

function sendToAnalytics(metric: any) {
  const { id, name, value, rating } = metric

  fetch('/api/analytics/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      name,
      value,
      rating,
      url: window.location.pathname,
      timestamp: Date.now(),
    }),
  }).catch((error) => {
    console.error('Failed to send vitals:', error)
  })
}
