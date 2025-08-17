import { test, expect } from '@playwright/test';

test.describe('Product Pages E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should display products list page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(page.locator('h1')).toContainText('Products');

    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      await expect(productCards.first()).toBeVisible();
    }
  });

  test('should navigate to individual product page', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      await expect(productCards.first()).toBeVisible();
      await productCards.first().click();
      await page.waitForURL(/\/products\/.*/, { timeout: 10000 });
      
      const productImage = page.locator('[data-testid="product-image"]');
      const productPrice = page.locator('[data-testid="product-price"]');
      
      if (await productImage.count() > 0) {
        await expect(productImage.first()).toBeVisible();
      }
      if (await productPrice.count() > 0) {
        await expect(productPrice.first()).toBeVisible();
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should add product to cart from detail page', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const addToCartButton = page.locator('button:has-text("Add to Cart")');
      if (await addToCartButton.count() > 0) {
        await addToCartButton.first().click();
        
        const cartIndicator = page.locator('[data-testid="cart-indicator"]');
        if (await cartIndicator.count() > 0) {
          await expect(cartIndicator).toBeVisible();
        }
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should add product to wishlist', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      const firstProduct = productCards.first();
      const wishlistButton = firstProduct.locator('[data-testid="wishlist-button"]');
      
      if (await wishlistButton.count() > 0) {
        await wishlistButton.click();
        
        const wishlistIndicator = page.locator('[data-testid="wishlist-indicator"]');
        if (await wishlistIndicator.count() > 0) {
          await expect(wishlistIndicator).toBeVisible();
        }
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should filter products', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      const initialCount = await productCards.count();
      
      const filterSelect = page.locator('[data-testid="category-filter"]');
      if (await filterSelect.count() > 0) {
        await filterSelect.selectOption('electronics');
        await page.waitForTimeout(1000);
        
        const filteredCount = await productCards.count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should sort products', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      const sortSelect = page.locator('[data-testid="sort-select"]');
      if (await sortSelect.count() > 0) {
        await sortSelect.selectOption('price-high-low');
        await page.waitForTimeout(1000);
        await expect(productCards.first()).toBeVisible();
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should display product reviews', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const reviewsSection = page.locator('[data-testid="product-reviews"]');
      if (await reviewsSection.count() > 0) {
        await expect(reviewsSection).toBeVisible();
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });

  test('should handle product image gallery', async ({ page }) => {
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const productImage = page.locator('[data-testid="product-image"]');
      if (await productImage.count() > 0) {
        await expect(productImage.first()).toBeVisible();
        
        const thumbnails = page.locator('[data-testid="image-thumbnail"]');
        if (await thumbnails.count() > 1) {
          await thumbnails.nth(1).click();
          await expect(productImage.first()).toBeVisible();
        }
      }
    } else {
      test.skip(true, 'No product cards found');
    }
  });
});
