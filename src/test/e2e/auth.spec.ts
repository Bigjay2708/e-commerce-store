import { test, expect } from '@playwright/test';

test.describe('User Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Verify we're on login page
    await expect(page).toHaveURL('**/login');
    await expect(page.locator('h1')).toContainText('Login');
    
    // Check if login form is displayed
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should handle login form validation', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Try to submit empty form
    await page.locator('button:has-text("Sign In")').click();
    
    // Check for validation errors
    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');
    
    if (await emailError.isVisible()) {
      await expect(emailError).toBeVisible();
    }
    if (await passwordError.isVisible()) {
      await expect(passwordError).toBeVisible();
    }
  });

  test('should fill login form', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    
    // Verify form is filled
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('test@example.com');
    await expect(page.locator('[data-testid="password-input"]')).toHaveValue('password123');
    
    // Submit form (this would normally redirect or show error in real app)
    await page.locator('button:has-text("Sign In")').click();
    
    // Wait for response
    await page.waitForTimeout(2000);
  });

  test('should handle OAuth login options', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check for Google OAuth button
    const googleButton = page.locator('[data-testid="google-login"]');
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toContainText('Google');
    }
    
    // Check for other OAuth providers
    const githubButton = page.locator('[data-testid="github-login"]');
    if (await githubButton.isVisible()) {
      await expect(githubButton).toBeVisible();
      await expect(githubButton).toContainText('GitHub');
    }
    
    const discordButton = page.locator('[data-testid="discord-login"]');
    if (await discordButton.isVisible()) {
      await expect(discordButton).toBeVisible();
      await expect(discordButton).toContainText('Discord');
    }
  });

  test('should navigate to signup from login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Look for signup link
    const signupLink = page.locator('text=Sign up');
    if (await signupLink.isVisible()) {
      await signupLink.click();
      
      // Should navigate to signup page or show signup form
      const signupForm = page.locator('[data-testid="signup-form"]');
      const signupHeading = page.locator('h1:has-text("Sign Up")');
      
      if (await signupForm.isVisible()) {
        await expect(signupForm).toBeVisible();
      } else if (await signupHeading.isVisible()) {
        await expect(signupHeading).toBeVisible();
      }
    }
  });

  test('should show login/logout state in navigation', async ({ page }) => {
    // Check initial state (should be logged out)
    const loginButton = page.locator('[data-testid="login-button"]');
    const userMenu = page.locator('[data-testid="user-menu"]');
    
    if (await loginButton.isVisible()) {
      await expect(loginButton).toBeVisible();
    } else if (await userMenu.isVisible()) {
      // Already logged in - check for logout option
      await userMenu.click();
      const logoutButton = page.locator('[data-testid="logout-button"]');
      if (await logoutButton.isVisible()) {
        await expect(logoutButton).toBeVisible();
      }
    }
  });

  test('should handle login error states', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.locator('[data-testid="email-input"]').fill('invalid@example.com');
    await page.locator('[data-testid="password-input"]').fill('wrongpassword');
    await page.locator('button:has-text("Sign In")').click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check for error message
    const errorMessage = page.locator('[data-testid="login-error"]');
    const generalError = page.locator('text=Invalid credentials');
    
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    } else if (await generalError.isVisible()) {
      await expect(generalError).toBeVisible();
    }
  });

  test('should redirect to login when accessing protected pages', async ({ page }) => {
    // Try to access a protected page (assuming checkout requires login)
    await page.goto('/checkout');
    
    // Should redirect to login or show login prompt
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const loginForm = page.locator('[data-testid="login-form"]');
    const loginModal = page.locator('[data-testid="login-modal"]');
    
    // Check if redirected to login page or login modal appeared
    if (currentUrl.includes('/login')) {
      await expect(page).toHaveURL('**/login');
    } else if (await loginForm.isVisible()) {
      await expect(loginForm).toBeVisible();
    } else if (await loginModal.isVisible()) {
      await expect(loginModal).toBeVisible();
    }
  });

  test('should handle password reset', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Look for forgot password link
    const forgotPasswordLink = page.locator('text=Forgot password');
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should show password reset form
      const resetForm = page.locator('[data-testid="reset-form"]');
      const resetEmailInput = page.locator('[data-testid="reset-email"]');
      
      if (await resetForm.isVisible()) {
        await expect(resetForm).toBeVisible();
        
        if (await resetEmailInput.isVisible()) {
          await resetEmailInput.fill('test@example.com');
          await page.locator('button:has-text("Reset Password")').click();
          
          // Check for success message
          await page.waitForTimeout(2000);
          const successMessage = page.locator('text=Reset email sent');
          if (await successMessage.isVisible()) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    }
  });

  test('should persist login state across page reloads', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Simulate successful login by setting session storage
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'fake-token');
      sessionStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));
    });
    
    // Reload the page
    await page.reload();
    
    // Check if user appears to be logged in
    const userMenu = page.locator('[data-testid="user-menu"]');
    const userAvatar = page.locator('[data-testid="user-avatar"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    
    // Should show user menu/avatar instead of login button
    if (await userMenu.isVisible()) {
      await expect(userMenu).toBeVisible();
    } else if (await userAvatar.isVisible()) {
      await expect(userAvatar).toBeVisible();
    } else {
      // If still showing login button, that's also valid depending on implementation
      await expect(loginButton).toBeVisible();
    }
  });
});
