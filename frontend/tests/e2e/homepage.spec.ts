import { test, expect } from '@playwright/test';

test.describe('CosmoDent Public Website', () => {
  test('should display homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/CosmoDent/);
    
    // Check hero section
    await expect(page.getByText('Сучасна стоматологія')).toBeVisible();
    
    // Check navigation
    await expect(page.getByRole('link', { name: 'Головна' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Послуги' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Лікарі' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Контакти' })).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Послуги' }).click();
    await expect(page).toHaveURL('/services');
    await expect(page.getByText('Наші послуги')).toBeVisible();
  });

  test('should navigate to doctors page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Лікарі' }).click();
    await expect(page).toHaveURL('/doctors');
    await expect(page.getByText('Наші лікарі')).toBeVisible();
  });

  test('should open booking form', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Записатися' }).click();
    await expect(page).toHaveURL('/booking');
    await expect(page.getByText('Запис на прийом')).toBeVisible();
  });

  test('should display services page with categories', async ({ page }) => {
    await page.goto('/services');
    
    await expect(page.getByText('Імплантація')).toBeVisible();
    await expect(page.getByText('Лікування зубів')).toBeVisible();
  });

  test('should display contacts page', async ({ page }) => {
    await page.goto('/contacts');
    
    await expect(page.getByText('Контакти')).toBeVisible();
    await expect(page.getByText('+380')).toBeVisible();
  });
});
