/**
 * apps/web/lib/api/relay.ts
 * Re-exports sendContactMessage as the relay trigger — keeps naming consistent
 * with the backend relay service. Components import from here, not from contact.ts.
 */
export { sendContactMessage as triggerRelay } from './contact'
