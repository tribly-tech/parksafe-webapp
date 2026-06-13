import { test, expect } from '@playwright/test'

const ADMIN_API_KEY =
  process.env['ADMIN_API_KEY'] ?? 'parksafe-admin-development-key-123456789'
const WEB_BASE = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://localhost:3000'
const API_BASE = `${WEB_BASE}/backend`

async function createFreshTag(request: import('@playwright/test').APIRequestContext): Promise<string> {
  const createRes = await request.post(`${API_BASE}/admin/tags/batches`, {
    headers: { 'X-Admin-Api-Key': ADMIN_API_KEY, 'Content-Type': 'application/json' },
    data: { count: 1 },
  })
  expect(createRes.ok()).toBeTruthy()
  const { batch } = (await createRes.json()) as { batch: { id: string } }

  let status = batch.id ? 'PENDING' : 'FAILED'
  for (let i = 0; i < 30; i++) {
    const poll = await request.get(`${API_BASE}/admin/tags/batches/${batch.id}`, {
      headers: { 'X-Admin-Api-Key': ADMIN_API_KEY },
    })
    const body = (await poll.json()) as { batch: { status: string } }
    status = body.batch.status
    if (status === 'COMPLETED') break
    if (status === 'FAILED') throw new Error('Batch generation failed')
    await new Promise(r => setTimeout(r, 500))
  }
  expect(status).toBe('COMPLETED')

  const zipRes = await request.get(`${API_BASE}/admin/tags/batches/${batch.id}/download`, {
    headers: { 'X-Admin-Api-Key': ADMIN_API_KEY },
  })
  expect(zipRes.ok()).toBeTruthy()
  const zipBuffer = await zipRes.body()
  const pngMatch = zipBuffer.toString('binary').match(
    /qr-codes\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.png/i
  )
  if (!pngMatch?.[1]) throw new Error('Could not parse tag code from batch ZIP')
  return pngMatch[1]
}

test.describe('QR scan → register vehicle', () => {
  test.setTimeout(60_000)

  test('generates QR, scans unregistered tag, completes registration', async ({ page, request }) => {
    const tagCode = await createFreshTag(request)
    const ownerPhone = `9${String(Date.now()).slice(-9)}`

    // Simulate scanning the QR — opens /contact/{tagCode}
    await page.goto(`/contact/${tagCode}`)
    await expect(page.getByText('Tag not activated')).toBeVisible()
    await page.getByRole('link', { name: 'Register vehicle' }).click()
    await expect(page).toHaveURL(new RegExp(`/register\\?tag=${tagCode}`))

    // Fill registration form
    await page.getByLabel('Vehicle Number').fill('MH12AB9999')
    await page.getByLabel('Vehicle Brand').fill('Hyundai')
    await page.getByLabel('Vehicle Model').fill('i20')
    await page.getByLabel('Vehicle Color').fill('Red')
    await page.locator('input[name="ownerName"]').fill('Test Owner')
    await page.locator('input[name="ownerPhone"]').fill(ownerPhone)
    await page.locator('input[name="emergencyName"]').fill('Emergency Contact')
    await page.locator('input[name="emergencyPhone"]').fill('9876543211')
    await page.locator('label[for="checkbox-consent"]').click()

    let devOtp = ''
    page.on('response', async response => {
      if (response.url().includes('/auth/request-otp') && response.ok()) {
        const body = (await response.json()) as { devOtp?: string }
        if (body.devOtp) devOtp = body.devOtp
      }
    })

    await page.getByRole('button', { name: 'Register Vehicle' }).click()
    await expect(page).toHaveURL(/\/register\/otp/)

    await expect.poll(() => devOtp.length).toBe(6)

    const otpInputs = page.locator('input[inputmode="numeric"]')
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(devOtp[i]!)
    }

    await expect(page).toHaveURL(/\/register\/success/, { timeout: 15_000 })
    await expect(page.getByText("You're all set!")).toBeVisible()

    const tagRes = await request.get(`${API_BASE}/tags/${tagCode}`)
    expect(tagRes.ok()).toBeTruthy()
    const tagBody = (await tagRes.json()) as { status: string; vehicle: { make: string } }
    expect(tagBody.status).toBe('ACTIVE')
    expect(tagBody.vehicle.make).toBe('Hyundai')
  })
})
