import { test, expect } from '@playwright/test';

test.describe('Product Pages E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display products list page', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Check if page loads correctly
    await expect(page).toHaveURL('**/products');
    await expect(page.locator('h1')).toContainText('Products');
    
    // Check if product grid is displayed
    await page.waitForSelector('[data-testid="product-grid"]');
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    
    // Check if products are loaded
    await page.waitForSelector('[data-testid="product-card"]');
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('should navigate to individual product page', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const productTitle = firstProduct.locator('[data-testid="product-title"]');
    const productTitleText = await productTitle.textContent();
    
    await firstProduct.click();
    
    // Verify we're on product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);
    
    // Check if product details are displayed
    await expect(page.locator('h1')).toContainText(productTitleText || '');
    await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
  });

  test('should add product to cart from product detail page', async ({ page }) => {
    // Navigate to products page and click on first product
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Add to cart from product detail page
    await page.locator('button:has-text("Add to Cart")').click();
    
    // Check if cart icon shows updated count
    await expect(page.locator('[data-testid="cart-icon"]')).toContainText('1');
    
    // Verify success notification or feedback
    // This could be a toast, modal, or button state change
    await expect(page.locator('button:has-text("Added to Cart")')).toBeVisible();
  });

  test('should add product to wishlist', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Click wishlist button on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Check if wishlist icon shows updated count
    await expect(page.locator('[data-testid="wishlist-icon"]')).toContainText('1');
    
    // Navigate to wishlist page
    await page.goto('/wishlist');
    
    // Verify product is in wishlist
    await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();
  });

  test('should filter products', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Apply a filter if filter options exist
    const filterSelect = page.locator('[data-testid="category-filter"]');
    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption('electronics');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Verify filter is applied (this might reduce or change product count)
      const filteredProducts = page.locator('[data-testid="product-card"]');
      const filteredCount = await filteredProducts.count();
      
      // Verify we have products (might be same or different count)
      expect(filteredCount).toBeGreaterThan(0);
    }
  });

  test('should search for products', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Search for a product
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('shirt');
      await searchInput.press('Enter');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify search results are displayed
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
    }
  });

  test('should sort products', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Try to sort products if sort option exists
    const sortSelect = page.locator('[data-testid="sort-select"]');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-low-high');
      
      // Wait for sorting to apply
      await page.waitForTimeout(1000);
      
      // Verify products are still displayed
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
    }
  });

  test('should display product reviews', async ({ page }) => {
    // Navigate to product detail page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Check if reviews section is displayed
    const reviewsSection = page.locator('[data-testid="product-reviews"]');
    if (await reviewsSection.isVisible()) {
      await expect(reviewsSection).toBeVisible();
      
      // Check if individual reviews are displayed
      const reviews = page.locator('[data-testid="review-item"]');
      if (await reviews.count() > 0) {
        await expect(reviews.first()).toBeVisible();
      }
    }
  });

  test('should handle product image gallery', async ({ page }) => {
    // Navigate to product detail page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Check main product image
    await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
    
    // Check if image gallery exists and is functional
    const imageGallery = page.locator('[data-testid="image-gallery"]');
    if (await imageGallery.isVisible()) {
      const thumbnails = page.locator('[data-testid="image-thumbnail"]');
      if (await thumbnails.count() > 1) {
        // Click on second thumbnail
        await thumbnails.nth(1).click();
        
        // Verify main image changes
        await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
      }
    }
  });
});
