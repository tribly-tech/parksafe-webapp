import { Hono } from 'hono'
import { getDashboardSummary } from '../services/dashboard.service'
import { getReportsReceived, getReportsSent } from '../services/reports.service'

export const dashboardRoutes = new Hono<{ Variables: { userId: string } }>()

/**
 * GET /dashboard
 * Returns aggregated stats, rewards, and recent contact events for the owner.
 */
dashboardRoutes.get('/', async c => {
  const userId = c.get('userId')
  const summary = await getDashboardSummary(userId)
  return c.json(summary)
})

/** GET /dashboard/reports/received — contact events on the owner's vehicles */
dashboardRoutes.get('/reports/received', async c => {
  const userId = c.get('userId')
  const events = await getReportsReceived(userId)
  return c.json({ events })
})

/** GET /dashboard/reports/sent — vehicles the owner reported to others */
dashboardRoutes.get('/reports/sent', async c => {
  const userId = c.get('userId')
  const events = await getReportsSent(userId)
  return c.json({ events })
})
