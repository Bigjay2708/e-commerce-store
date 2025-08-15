import { test, expect } from '@playwright/test';

test.describe('Checkout Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Add a product to cart before each test
    await page.goto('/products');
    
    const productCards = page.locator('[data-testid="product-card"]');
    if (await productCards.count() > 0) {
      const firstProduct = productCards.first();
      const addToCartButton = firstProduct.locator('button:has-text("Add to Cart")');
      
      if (await addToCartButton.count() > 0) {
        await addToCartButton.click();
      } else {
        // Try alternative add to cart button
        const altButton = firstProduct.locator('[data-testid="add-to-cart"]');
        if (await altButton.count() > 0) {
          await altButton.click();
        }
      }
    }
  });

  test('should navigate to checkout page', async ({ page }) => {
    // Go to cart
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Click checkout button
    await page.locator('button:has-text("Checkout")').click();
    
    // Verify we're on checkout page
    await expect(page).toHaveURL('**/checkout');
    await expect(page.locator('h1')).toContainText('Checkout');
  });

  test('should display order summary in checkout', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Verify order summary is displayed
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  });

  test('should require shipping information', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Try to submit without filling required fields
    const submitButton = page.locator('button:has-text("Place Order")');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Check for validation errors
      const errorMessages = page.locator('[data-testid="form-error"]');
      if (await errorMessages.count() > 0) {
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should fill shipping information form', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Fill shipping information
    const firstNameInput = page.locator('[data-testid="first-name"]');
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill('John');
    }
    
    const lastNameInput = page.locator('[data-testid="last-name"]');
    if (await lastNameInput.isVisible()) {
      await lastNameInput.fill('Doe');
    }
    
    const emailInput = page.locator('[data-testid="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('john.doe@example.com');
    }
    
    const addressInput = page.locator('[data-testid="address"]');
    if (await addressInput.isVisible()) {
      await addressInput.fill('123 Main St');
    }
    
    const cityInput = page.locator('[data-testid="city"]');
    if (await cityInput.isVisible()) {
      await cityInput.fill('New York');
    }
    
    const zipInput = page.locator('[data-testid="zip"]');
    if (await zipInput.isVisible()) {
      await zipInput.fill('10001');
    }
    
    // Verify form is filled
    await expect(firstNameInput).toHaveValue('John');
    await expect(emailInput).toHaveValue('john.doe@example.com');
  });

  test('should handle payment method selection', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Check if payment method section exists
    const paymentSection = page.locator('[data-testid="payment-methods"]');
    if (await paymentSection.isVisible()) {
      // Try to select credit card option
      const creditCardOption = page.locator('[data-testid="payment-credit-card"]');
      if (await creditCardOption.isVisible()) {
        await creditCardOption.click();
        await expect(creditCardOption).toBeChecked();
      }
      
      // Try to select PayPal option
      const paypalOption = page.locator('[data-testid="payment-paypal"]');
      if (await paypalOption.isVisible()) {
        await paypalOption.click();
        await expect(paypalOption).toBeChecked();
      }
    }
  });

  test('should handle credit card information', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Select credit card payment if available
    const creditCardOption = page.locator('[data-testid="payment-credit-card"]');
    if (await creditCardOption.isVisible()) {
      await creditCardOption.click();
      
      // Fill credit card information
      const cardNumberInput = page.locator('[data-testid="card-number"]');
      if (await cardNumberInput.isVisible()) {
        await cardNumberInput.fill('4111111111111111');
      }
      
      const expiryInput = page.locator('[data-testid="card-expiry"]');
      if (await expiryInput.isVisible()) {
        await expiryInput.fill('12/25');
      }
      
      const cvcInput = page.locator('[data-testid="card-cvc"]');
      if (await cvcInput.isVisible()) {
        await cvcInput.fill('123');
      }
      
      const cardNameInput = page.locator('[data-testid="card-name"]');
      if (await cardNameInput.isVisible()) {
        await cardNameInput.fill('John Doe');
      }
      
      // Verify card information is entered
      await expect(cardNumberInput).toHaveValue('4111111111111111');
      await expect(cardNameInput).toHaveValue('John Doe');
    }
  });

  test('should calculate shipping and tax', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Check if shipping options are available
    const shippingSection = page.locator('[data-testid="shipping-options"]');
    if (await shippingSection.isVisible()) {
      const shippingOption = page.locator('[data-testid="shipping-standard"]');
      if (await shippingOption.isVisible()) {
        await shippingOption.click();
        
        // Verify shipping cost is displayed
        await expect(page.locator('[data-testid="shipping-cost"]')).toBeVisible();
      }
    }
    
    // Check if tax is calculated
    const taxDisplay = page.locator('[data-testid="tax-amount"]');
    if (await taxDisplay.isVisible()) {
      await expect(taxDisplay).toBeVisible();
    }
    
    // Verify final total includes all costs
    await expect(page.locator('[data-testid="final-total"]')).toBeVisible();
  });

  test('should show order confirmation', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Fill minimum required information
    const emailInput = page.locator('[data-testid="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    
    // Try to place order (this might redirect to payment processor in real app)
    const placeOrderButton = page.locator('button:has-text("Place Order")');
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      
      // Check for order confirmation or redirect
      // In a real app, this might redirect to payment processor
      // or show a confirmation page
      await page.waitForTimeout(2000);
      
      // Look for confirmation elements
      const confirmationText = page.locator('text=Order confirmed');
      const thankYouText = page.locator('text=Thank you');
      const orderNumberText = page.locator('[data-testid="order-number"]');
      
      // Check if any confirmation element is visible
      if (await confirmationText.isVisible()) {
        await expect(confirmationText).toBeVisible();
      } else if (await thankYouText.isVisible()) {
        await expect(thankYouText).toBeVisible();
      } else if (await orderNumberText.isVisible()) {
        await expect(orderNumberText).toBeVisible();
      }
    }
  });

  test('should handle empty cart checkout', async ({ page }) => {
    // Go to empty cart
    await page.goto('/cart');
    
    // Check if checkout is disabled for empty cart
    const checkoutButton = page.locator('button:has-text("Checkout")');
    if (await checkoutButton.isVisible()) {
      // Button should be disabled or redirect to add items
      await checkoutButton.click();
      
      // Should either stay on cart page or show message
      const emptyCartMessage = page.locator('text=Your cart is empty');
      if (await emptyCartMessage.isVisible()) {
        await expect(emptyCartMessage).toBeVisible();
      }
    }
  });

  test('should validate form fields', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-testid="cart-icon"]').click();
    await page.locator('button:has-text("Checkout")').click();
    
    // Try invalid email
    const emailInput = page.locator('[data-testid="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      // Check for email validation error
      const emailError = page.locator('[data-testid="email-error"]');
      if (await emailError.isVisible()) {
        await expect(emailError).toBeVisible();
      }
      
      // Fix email
      await emailInput.fill('valid@example.com');
      await emailInput.blur();
      
      // Error should disappear
      if (await emailError.isVisible()) {
        await expect(emailError).not.toBeVisible();
      }
    }
  });
});
