import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** MSW server for Vitest — started in vitest.setup.ts. */
export const server = setupServer(...handlers)
