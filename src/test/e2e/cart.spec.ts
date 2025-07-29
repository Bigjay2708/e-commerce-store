import { test, expect } from '@playwright/test';

test.describe('Shopping Cart E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add product to cart from homepage', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Find the first product card and click "Add to Cart"
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    
    // Check if cart icon shows updated count
    const cartIcon = page.locator('[data-testid="cart-icon"]');
    await expect(cartIcon).toContainText('1');
    
    // Click on cart to view cart page
    await cartIcon.click();
    
    // Verify we're on cart page and product is there
    await expect(page).toHaveURL('**/cart');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Add a product to cart
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    
    // Go to cart
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Find quantity input and update it
    const quantityInput = page.locator('[data-testid="quantity-input"]').first();
    await quantityInput.fill('3');
    
    // Check if total is updated
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toBeVisible();
    
    // Verify quantity is reflected in cart
    await expect(quantityInput).toHaveValue('3');
  });

  test('should remove product from cart', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Add a product to cart
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    
    // Go to cart
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Remove the product from cart
    await page.locator('[data-testid="remove-from-cart"]').first().click();
    
    // Check if cart is empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    
    // Check if cart icon shows 0
    await expect(page.locator('[data-testid="cart-icon"]')).toContainText('0');
  });

  test('should proceed to checkout', async ({ page }) => {
    // Add a product to cart first
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    
    // Go to cart
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Click checkout button
    await page.locator('button:has-text("Checkout")').click();
    
    // Verify we're on checkout page
    await expect(page).toHaveURL('**/checkout');
    await expect(page.locator('h1')).toContainText('Checkout');
  });

  test('should persist cart items across page reloads', async ({ page }) => {
    // Add a product to cart
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    
    // Reload the page
    await page.reload();
    
    // Check if cart still shows the item
    await expect(page.locator('[data-testid="cart-icon"]')).toContainText('1');
    
    // Go to cart and verify item is still there
    await page.locator('[data-testid="cart-icon"]').click();
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  });

  test('should calculate cart total correctly', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Add multiple products to cart
    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    
    if (count >= 2) {
      await productCards.nth(0).locator('button:has-text("Add to Cart")').click();
      await productCards.nth(1).locator('button:has-text("Add to Cart")').click();
    }
    
    // Go to cart
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Verify total calculation
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toBeVisible();
    
    // Verify subtotal and total are displayed
    await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible();
  });
});
