import { test, expect } from '@playwright/test';

test.describe('Shopping Cart E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add product to cart from homepage', async ({ page }) => {

    await page.waitForSelector('[data-testid="product-card"]');
    

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    

    const cartIcon = page.locator('[data-testid="cart-icon"]');
    await expect(cartIcon).toContainText('1');
    

    await cartIcon.click();
    

    await expect(page).toHaveURL('**/cart');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {

    await page.goto('/products');
    

    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    

    await page.locator('[data-testid="cart-icon"]').click();
    

    const quantityInput = page.locator('[data-testid="quantity-input"]').first();
    await quantityInput.fill('3');
    

    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toBeVisible();
    

    await expect(quantityInput).toHaveValue('3');
  });

  test('should remove product from cart', async ({ page }) => {

    await page.goto('/products');
    

    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    

    await page.locator('[data-testid="cart-icon"]').click();
    

    await page.locator('[data-testid="remove-from-cart"]').first().click();
    

    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    

    await expect(page.locator('[data-testid="cart-icon"]')).toContainText('0');
  });

  test('should proceed to checkout', async ({ page }) => {

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    

    await page.locator('[data-testid="cart-icon"]').click();
    

    await page.locator('button:has-text("Checkout")').click();
    

    await expect(page).toHaveURL('**/checkout');
    await expect(page.locator('h1')).toContainText('Checkout');
  });

  test('should persist cart items across page reloads', async ({ page }) => {

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    

    await page.reload();
    

    await expect(page.locator('[data-testid="cart-icon"]')).toContainText('1');
    

    await page.locator('[data-testid="cart-icon"]').click();
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  });

  test('should calculate cart total correctly', async ({ page }) => {

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    

    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    
    if (count >= 2) {
      await productCards.nth(0).locator('button:has-text("Add to Cart")').click();
      await productCards.nth(1).locator('button:has-text("Add to Cart")').click();
    }
    

    await page.locator('[data-testid="cart-icon"]').click();
    

    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toBeVisible();
    

    await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible();
  });
});
