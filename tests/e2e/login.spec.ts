import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('loads login page with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /masuk/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/kata sandi/i)).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('wrong@bimbel.one');
    await page.getByLabel(/kata sandi/i).fill('wrongpassword');
    await page.getByRole('button', { name: /masuk/i }).click();
    await expect(page.getByText(/kredensial tidak valid/i)).toBeVisible();
  });

  test('logs in successfully with tutor credentials and navigates', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('ayu@bimbel.one');
    await page.getByLabel(/kata sandi/i).fill('Tutor123!');
    await page.getByRole('button', { name: /masuk/i }).click();

    await page.waitForURL(/\/screens\//);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('protected /screens route redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/screens');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});
