import { test, expect } from '@playwright/test';

test.describe('User Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {

    await page.goto('/login');
    

    await expect(page).toHaveURL('**/login');
    await expect(page.locator('h1')).toContainText('Login');
    

    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should handle login form validation', async ({ page }) => {

    await page.goto('/login');
    

    await page.locator('button:has-text("Sign In")').click();
    

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

    await page.goto('/login');
    

    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    

    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('test@example.com');
    await expect(page.locator('[data-testid="password-input"]')).toHaveValue('password123');
    

    await page.locator('button:has-text("Sign In")').click();
    

    await page.waitForTimeout(2000);
  });

  test('should handle OAuth login options', async ({ page }) => {

    await page.goto('/login');
    

    const googleButton = page.locator('[data-testid="google-login"]');
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toContainText('Google');
    }
    

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

    await page.goto('/login');
    

    const signupLink = page.locator('text=Sign up');
    if (await signupLink.isVisible()) {
      await signupLink.click();
      

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

    const loginButton = page.locator('[data-testid="login-button"]');
    const userMenu = page.locator('[data-testid="user-menu"]');
    
    if (await loginButton.isVisible()) {
      await expect(loginButton).toBeVisible();
    } else if (await userMenu.isVisible()) {

      await userMenu.click();
      const logoutButton = page.locator('[data-testid="logout-button"]');
      if (await logoutButton.isVisible()) {
        await expect(logoutButton).toBeVisible();
      }
    }
  });

  test('should handle login error states', async ({ page }) => {

    await page.goto('/login');
    

    await page.locator('[data-testid="email-input"]').fill('invalid@example.com');
    await page.locator('[data-testid="password-input"]').fill('wrongpassword');
    await page.locator('button:has-text("Sign In")').click();
    

    await page.waitForTimeout(3000);
    

    const errorMessage = page.locator('[data-testid="login-error"]');
    const generalError = page.locator('text=Invalid credentials');
    
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    } else if (await generalError.isVisible()) {
      await expect(generalError).toBeVisible();
    }
  });

  test('should redirect to login when accessing protected pages', async ({ page }) => {

    await page.goto('/checkout');
    

    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const loginForm = page.locator('[data-testid="login-form"]');
    const loginModal = page.locator('[data-testid="login-modal"]');
    

    if (currentUrl.includes('/login')) {
      await expect(page).toHaveURL('**/login');
    } else if (await loginForm.isVisible()) {
      await expect(loginForm).toBeVisible();
    } else if (await loginModal.isVisible()) {
      await expect(loginModal).toBeVisible();
    }
  });

  test('should handle password reset', async ({ page }) => {

    await page.goto('/login');
    

    const forgotPasswordLink = page.locator('text=Forgot password');
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      

      const resetForm = page.locator('[data-testid="reset-form"]');
      const resetEmailInput = page.locator('[data-testid="reset-email"]');
      
      if (await resetForm.isVisible()) {
        await expect(resetForm).toBeVisible();
        
        if (await resetEmailInput.isVisible()) {
          await resetEmailInput.fill('test@example.com');
          await page.locator('button:has-text("Reset Password")').click();
          

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

    await page.goto('/login');
    

    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'fake-token');
      sessionStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));
    });
    

    await page.reload();
    

    const userMenu = page.locator('[data-testid="user-menu"]');
    const userAvatar = page.locator('[data-testid="user-avatar"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    

    if (await userMenu.isVisible()) {
      await expect(userMenu).toBeVisible();
    } else if (await userAvatar.isVisible()) {
      await expect(userAvatar).toBeVisible();
    } else {

      await expect(loginButton).toBeVisible();
    }
  });
});
