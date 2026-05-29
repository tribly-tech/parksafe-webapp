import { test, expect } from '@playwright/test'

test.describe('Sign in', () => {
  test('shows mobile number form', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByLabel('Mobile number')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send OTP' })).toBeDisabled()
  })

  test('enables send OTP for valid Indian mobile', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Mobile number').fill('9876543210')
    await expect(page.getByRole('button', { name: 'Send OTP' })).toBeEnabled()
  })

  test('shows not registered message for unknown phone', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Mobile number').fill('9123456789')
    await page.getByRole('button', { name: 'Send OTP' }).click()
    await expect(page.getByText('This number is not registered with ParkSafe')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Register your vehicle' }).first()).toBeVisible()
  })

  test('register link opens QR scan start page', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('link', { name: 'Register your vehicle' }).click()
    await expect(page).toHaveURL(/\/register\/start/)
    await expect(page.getByRole('heading', { name: 'Scan your ParkSafe QR tag' })).toBeVisible()
  })

  test('registered phone navigates to OTP URL', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Mobile number').fill('9876543210')
    await page.getByRole('button', { name: 'Send OTP' }).click()
    await expect(page).toHaveURL(/\/sign-in\/otp/)
  })
})
