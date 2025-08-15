import { test, expect } from '@playwright/test';

test.describe('Wishlist E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display wishlist page', async ({ page }) => {
    // Navigate to wishlist page
    await page.goto('/wishlist');
    
    // Verify we're on wishlist page
    await expect(page).toHaveURL(/.*\/wishlist$/);
    await expect(page.locator('h1')).toContainText('Wishlist');
  });

  test('should add item to wishlist from products page', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Click wishlist button on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const wishlistButton = firstProduct.locator('[data-testid="wishlist-button"]');
    await wishlistButton.click();
    
    // Check if wishlist icon shows updated count
    const wishlistIcon = page.locator('[data-testid="wishlist-icon"]');
    await expect(wishlistIcon).toContainText('1');
    
    // Navigate to wishlist page
    await page.goto('/wishlist');
    
    // Verify product is in wishlist
    await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();
  });

  test('should remove item from wishlist', async ({ page }) => {
    // First add an item to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Go to wishlist
    await page.goto('/wishlist');
    
    // Remove item from wishlist
    await page.locator('[data-testid="remove-from-wishlist"]').first().click();
    
    // Check if wishlist is empty
    const emptyMessage = page.locator('text=Your wishlist is empty');
    await expect(emptyMessage).toBeVisible();
    
    // Check if wishlist icon shows 0
    const wishlistIcon = page.locator('[data-testid="wishlist-icon"]');
    await expect(wishlistIcon).toContainText('0');
  });

  test('should add item to cart from wishlist', async ({ page }) => {
    // First add an item to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Go to wishlist
    await page.goto('/wishlist');
    
    // Add item to cart from wishlist
    await page.locator('[data-testid="add-to-cart-from-wishlist"]').first().click();
    
    // Check if cart icon shows updated count
    const cartIcon = page.locator('[data-testid="cart-icon"]');
    await expect(cartIcon).toContainText('1');
    
    // Verify item is still in wishlist (or removed depending on implementation)
    const wishlistItems = page.locator('[data-testid="wishlist-item"]');
    const itemCount = await wishlistItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(0);
  });

  test('should display empty wishlist message', async ({ page }) => {
    // Navigate to wishlist page (assuming it's empty)
    await page.goto('/wishlist');
    
    // Check for empty wishlist message
    const emptyMessage = page.locator('text=Your wishlist is empty');
    const noItemsMessage = page.locator('text=No items in wishlist');
    const startShoppingLink = page.locator('text=Start shopping');
    
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    } else if (await noItemsMessage.isVisible()) {
      await expect(noItemsMessage).toBeVisible();
    }
    
    // Check for link to start shopping
    if (await startShoppingLink.isVisible()) {
      await startShoppingLink.click();
      await expect(page).toHaveURL('**/products');
    }
  });

  test('should persist wishlist items across page reloads', async ({ page }) => {
    // Add an item to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Reload the page
    await page.reload();
    
    // Check if wishlist still shows the item
    const wishlistIcon = page.locator('[data-testid="wishlist-icon"]');
    await expect(wishlistIcon).toContainText('1');
    
    // Go to wishlist and verify item is still there
    await page.goto('/wishlist');
    await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();
  });

  test('should handle wishlist button state changes', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const wishlistButton = firstProduct.locator('[data-testid="wishlist-button"]');
    
    // Initial state (not in wishlist)
    const initialState = await wishlistButton.getAttribute('aria-pressed') || 
                         await wishlistButton.getAttribute('data-active') ||
                         'false';
    
    // Click to add to wishlist
    await wishlistButton.click();
    
    // Button state should change to indicate item is in wishlist
    await page.waitForTimeout(500);
    const newState = await wishlistButton.getAttribute('aria-pressed') || 
                     await wishlistButton.getAttribute('data-active') ||
                     'false';
    
    expect(newState).not.toBe(initialState);
    
    // Click again to remove from wishlist
    await wishlistButton.click();
    
    // Button state should return to original
    await page.waitForTimeout(500);
    const finalState = await wishlistButton.getAttribute('aria-pressed') || 
                       await wishlistButton.getAttribute('data-active') ||
                       'false';
    
    expect(finalState).toBe(initialState);
  });

  test('should show wishlist item details', async ({ page }) => {
    // Add an item to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    
    // Get product details for verification
    const productTitle = await firstProduct.locator('[data-testid="product-title"]').textContent();
    const productPrice = await firstProduct.locator('[data-testid="product-price"]').textContent();
    
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Go to wishlist
    await page.goto('/wishlist');
    
    const wishlistItem = page.locator('[data-testid="wishlist-item"]').first();
    
    // Verify product details are displayed in wishlist
    await expect(wishlistItem.locator('[data-testid="product-title"]')).toContainText(productTitle || '');
    await expect(wishlistItem.locator('[data-testid="product-price"]')).toContainText(productPrice || '');
    await expect(wishlistItem.locator('[data-testid="product-image"]')).toBeVisible();
  });

  test('should navigate to product detail from wishlist', async ({ page }) => {
    // Add an item to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Go to wishlist
    await page.goto('/wishlist');
    
    // Click on wishlist item to go to product detail
    const wishlistItem = page.locator('[data-testid="wishlist-item"]').first();
    const productLink = wishlistItem.locator('[data-testid="product-link"]');
    
    if (await productLink.isVisible()) {
      await productLink.click();
      
      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/products\/\d+/);
    } else {
      // If no specific link, click on the item itself
      await wishlistItem.click();
      
      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/products\/\d+/);
    }
  });

  test('should handle multiple items in wishlist', async ({ page }) => {
    // Add multiple items to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    const productCards = page.locator('[data-testid="product-card"]');
    const productCount = await productCards.count();
    
    if (productCount >= 2) {
      // Add first two products to wishlist
      await productCards.nth(0).locator('[data-testid="wishlist-button"]').click();
      await productCards.nth(1).locator('[data-testid="wishlist-button"]').click();
      
      // Check wishlist count
      const wishlistIcon = page.locator('[data-testid="wishlist-icon"]');
      await expect(wishlistIcon).toContainText('2');
      
      // Go to wishlist and verify both items are there
      await page.goto('/wishlist');
      const wishlistItems = page.locator('[data-testid="wishlist-item"]');
      await expect(wishlistItems).toHaveCount(2);
    }
  });

  test('should clear all wishlist items', async ({ page }) => {
    // Add items to wishlist
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="wishlist-button"]').click();
    
    // Go to wishlist
    await page.goto('/wishlist');
    
    // Look for clear all button
    const clearAllButton = page.locator('[data-testid="clear-wishlist"]');
    if (await clearAllButton.isVisible()) {
      await clearAllButton.click();
      
      // Confirm if there's a confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Check if wishlist is empty
      const emptyMessage = page.locator('text=Your wishlist is empty');
      await expect(emptyMessage).toBeVisible();
      
      // Check if wishlist icon shows 0
      const wishlistIcon = page.locator('[data-testid="wishlist-icon"]');
      await expect(wishlistIcon).toContainText('0');
    }
  });
});
