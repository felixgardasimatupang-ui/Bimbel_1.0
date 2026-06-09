import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('login page should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
