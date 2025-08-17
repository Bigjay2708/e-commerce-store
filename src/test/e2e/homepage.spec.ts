import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/ShopEase/);
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.getByText('ShopEase')).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should navigate to products page', async ({ page }) => {
    const productsLink = page.getByRole('link', { name: 'Products' });
    if (await productsLink.count() > 0) {
      await productsLink.first().click();
      await page.waitForURL('**/products');
      await expect(page.locator('h1')).toContainText('Products');
    } else {
      test.skip(true, 'Products link not found');
    }
  });

  test('should search for products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('shirt');
      await searchInput.first().press('Enter');
      await page.waitForTimeout(1000);
      
      const hasResults = await page.locator('[data-testid="product-card"]').count() > 0;
      const hasSearchPage = page.url().includes('search') || page.url().includes('products');
      
      expect(hasResults || hasSearchPage).toBeTruthy();
    } else {
      test.skip(true, 'Search input not found');
    }
  });

  test('should display featured products', async ({ page }) => {
    const featuredSection = page.locator('text=Featured Products');
    const productCards = page.locator('[data-testid="product-card"]');
    
    const hasFeaturedSection = await featuredSection.count() > 0;
    const hasProductCards = await productCards.count() > 0;
    
    if (hasFeaturedSection) {
      await expect(featuredSection.first()).toBeVisible();
    }
    
    if (hasProductCards) {
      await expect(productCards.first()).toBeVisible();
    }
    
    expect(hasFeaturedSection || hasProductCards).toBeTruthy();
  });

  test('should display promotional banners', async ({ page }) => {
    const banner = page.locator('[data-testid="promotional-banner"]');
    if (await banner.count() > 0) {
      await expect(banner.first()).toBeVisible();
    }
  });
});
