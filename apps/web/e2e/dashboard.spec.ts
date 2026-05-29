import { test, expect } from '@playwright/test'

const AUTH_STORAGE = {
  state: {
    token: 'dev-session:test-user',
    userId: '00000000-0000-0000-0000-000000000010',
  },
  version: 0,
}

test.describe('Owner Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(storage => {
      localStorage.setItem('parksafe-auth', JSON.stringify(storage))
    }, AUTH_STORAGE)
  })

  test('dashboard page loads with driving score', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('park safe')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByText('Active vehicles')).toBeVisible()
  })

  test('shows register and buy quick action cards', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: /Register vehicle/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Buy ParkSafe tag/i })).toBeVisible()
  })

  test('register card opens QR scan start page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Register vehicle/i }).click()
    await expect(page).toHaveURL(/\/register\/start/)
  })

  test('stat cards navigate to detail pages', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Active vehicles: 2/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/vehicles/)
    await expect(page.getByText('Maruti Suzuki')).toBeVisible()
    await expect(page.getByText('Swift')).toBeVisible()
    await expect(page.getByText('MH 12 AB 1234')).toBeVisible()
  })

  test('vehicle actions menu shows make inactive option', async ({ page }) => {
    await page.goto('/dashboard/vehicles')
    await page.getByRole('button', { name: /Actions for Maruti Suzuki Swift/i }).click()
    await expect(page.getByRole('menuitem', { name: 'Make inactive' })).toBeVisible()
  })

  test('redirects to sign-in when not authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('parksafe-auth')
    })
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/sign-in/)
  })
})
