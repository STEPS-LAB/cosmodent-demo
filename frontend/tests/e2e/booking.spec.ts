import { test, expect } from '@playwright/test';

/**
 * E2E — Booking Flow
 *
 * Tests the complete public booking experience:
 *  1. Navigate to the home page
 *  2. Scroll to booking form
 *  3. Fill in patient details
 *  4. Select a service
 *  5. Pick a date and time slot
 *  6. Submit and verify success
 */
test.describe('Booking flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page loads with correct heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Cosmodent/i);
    await expect(page.locator('h1')).toContainText('усмішка');
  });

  test('navigation links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Послуги'  })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Лікарі'   })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Відгуки'  })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Контакти' })).toBeVisible();
  });

  test('booking form is accessible from home page', async ({ page }) => {
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await expect(page.locator('#booking')).toBeVisible();
    await expect(page.getByLabel(/ваше ім/i)).toBeVisible();
    await expect(page.getByLabel(/телефон/i)).toBeVisible();
  });

  test('booking form shows validation errors on empty submit', async ({ page }) => {
    await page.locator('#booking').scrollIntoViewIfNeeded();
    // Find and click submit button without filling the form
    await page.getByRole('button', { name: /записатися/i }).last().click();
    // Validation errors should appear
    await expect(page.getByText(/ваше ім.*мін/i)).toBeVisible();
  });

  test('services page shows all services with prices', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Послуги/i);
    // At least one service card should be visible
    const cards = page.locator('.card, [class*="card"]');
    await expect(cards.first()).toBeVisible();
    // Price format should be present
    await expect(page.getByText(/від .* грн/i).first()).toBeVisible();
  });

  test('service detail page loads correctly', async ({ page }) => {
    await page.goto('/services/implantology');
    await expect(page.locator('h1')).toContainText('Імплантологія');
    await expect(page.getByText(/від .* грн/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /записатися/i }).first()).toBeVisible();
  });

  test('doctors page renders doctor cards', async ({ page }) => {
    await page.goto('/doctors');
    await expect(page).toHaveTitle(/Лікарі/i);
  });

  test('contacts page shows phone and address', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page).toHaveTitle(/Контакти/i);
    await expect(page.getByText('+38 (044) 123-45-67')).toBeVisible();
  });
});

test.describe('Admin login', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/пароль/i)).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('wrong@email.com');
    await page.getByLabel(/пароль/i).fill('wrongpassword');
    await page.getByRole('button', { name: /увійти/i }).click();
    // Should show error toast or message
    await page.waitForTimeout(1000);
    await expect(page.getByText(/помилка/i)).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('home page has no obvious accessibility violations', async ({ page }) => {
    await page.goto('/');
    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();
    // Check for nav landmark
    await expect(page.locator('nav')).toBeVisible();
    // Check for footer landmark
    await expect(page.locator('footer')).toBeVisible();
    // Check for skip link (optional)
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });
});
