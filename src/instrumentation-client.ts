import { registerWebVitals } from './lib/web-vitals'

// Initialize web vitals tracking before React hydration begins.
// This ensures we capture metrics from the earliest possible moment
// in the page lifecycle.
registerWebVitals()
