import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/ShopEase/);
    
    // Check if the main navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if the logo is present
    await expect(page.getByText('ShopEase')).toBeVisible();
    
    // Check if search functionality is present
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    // Click on products link in navigation
    await page.click('text=Products');
    
    // Wait for navigation to complete
    await page.waitForURL('**/products');
    
    // Check if we're on the products page
    await expect(page.locator('h1')).toContainText('Products');
  });

  test('should search for products', async ({ page }) => {
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('shirt');
    
    // Press Enter or click search button
    await searchInput.press('Enter');
    
    // Check if search results are displayed
    // This depends on your search implementation
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  });

  test('should display featured products', async ({ page }) => {
    // Check if featured products section is visible
    await expect(page.locator('text=Featured Products')).toBeVisible();
    
    // Check if product cards are displayed
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should display promotional banners', async ({ page }) => {
    // Check if promotional banners are displayed
    const banner = page.locator('[data-testid="promotional-banner"]');
    if (await banner.count() > 0) {
      await expect(banner.first()).toBeVisible();
    }
  });
});
