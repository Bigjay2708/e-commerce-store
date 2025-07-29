# Testing Infrastructure Documentation

## Overview

This e-commerce application has comprehensive testing infrastructure with **>80% coverage target** including unit tests, integration tests, and end-to-end tests.

## Testing Stack

### Core Testing Tools

- **Vitest** - Fast unit test runner with native TypeScript support
- **Testing Library** - React component testing utilities
- **Playwright** - Cross-browser E2E testing
- **jsdom** - DOM environment for unit tests

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   ├── utils.tsx             # Test utilities and mock data
│   ├── integration/          # Integration tests
│   │   └── cart.test.tsx
│   └── e2e/                  # End-to-end tests
│       ├── homepage.spec.ts
│       ├── cart.spec.ts
│       ├── products.spec.ts
│       ├── checkout.spec.ts
│       ├── auth.spec.ts
│       └── wishlist.spec.ts
├── components/__tests__/     # Component unit tests
│   ├── Button.test.tsx
│   ├── ProductCard.test.tsx
│   ├── Navbar.test.tsx
│   └── ProductGrid.test.tsx
├── store/__tests__/          # Store unit tests
│   ├── cart.test.ts
│   ├── wishlist.test.ts
│   └── theme.test.ts
└── lib/__tests__/            # Utility unit tests
    └── api.test.ts
```

## Test Commands

```bash
# Unit and Integration Tests
npm test                    # Run all unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:ui           # Run tests with UI interface

# End-to-End Tests
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:setup    # Install Playwright browsers
```

## Test Types

### 1. Unit Tests

Test individual components, stores, and utilities in isolation.

**Stores Tested:**

- ✅ Cart Store (add, remove, update quantity, clear)
- ✅ Wishlist Store (add, remove, toggle)
- ✅ Theme Store (light/dark theme toggle, persistence)

**Components Tested:**

- ✅ Button (variants, sizes, states, accessibility)
- ✅ ProductCard (display, interactions, store integration)
- ✅ Navbar (navigation, cart/wishlist counts)
- ✅ ProductGrid (layout, loading, error states)

**Utilities Tested:**

- ✅ API functions (fetch products, error handling, network issues)

### 2. Integration Tests

Test interactions between multiple components and systems.

**Cart Integration:**

- ✅ Adding products to cart
- ✅ Updating quantities
- ✅ Cart state persistence
- ✅ Store integration

### 3. End-to-End Tests

Test complete user workflows across the application.

**Homepage E2E:**

- ✅ Page load and navigation
- ✅ Search functionality
- ✅ Featured products display
- ✅ Promotional banners

**Shopping Cart E2E:**

- ✅ Add products to cart
- ✅ Update quantities
- ✅ Remove products
- ✅ Cart persistence
- ✅ Proceed to checkout

**Product Pages E2E:**

- ✅ Product listing
- ✅ Product details
- ✅ Wishlist integration
- ✅ Search and filtering

**Checkout Flow E2E:**

- ✅ Order summary
- ✅ Shipping information
- ✅ Payment methods
- ✅ Form validation

**Authentication E2E:**

- ✅ Login forms
- ✅ OAuth integration
- ✅ Protected routes
- ✅ Session persistence

**Wishlist E2E:**

- ✅ Add/remove items
- ✅ Cart integration
- ✅ State persistence

## Mock Strategy

### Global Mocks (test/setup.ts)

- Next.js Router
- Next.js Image component
- NextAuth session
- localStorage/sessionStorage
- Window APIs

### Test Utilities (test/utils.tsx)

- Mock product data generators
- Custom render function with providers
- Store mock helpers

## Configuration Files

### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: "./src/test/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
  ],
});
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory with:

- HTML reports (coverage/index.html)
- Terminal summary
- Detailed file-by-file breakdown

## Best Practices

### Unit Tests

- Test component behavior, not implementation
- Mock external dependencies
- Use meaningful test descriptions
- Test edge cases and error states

### Integration Tests

- Focus on component interactions
- Test data flow between systems
- Verify store integrations

### E2E Tests

- Test critical user journeys
- Use data-testid attributes for reliable selectors
- Test across different browsers and devices
- Handle loading states and async operations

## Continuous Integration

The testing setup is designed for CI/CD pipelines:

- All tests run in headless mode by default
- Coverage reports can be uploaded to coverage services
- E2E tests include screenshot/video capture on failures
- Parallelization support for faster execution

## Debugging Tests

### Unit Tests

```bash
npm run test:ui          # Visual test runner
npm run test:watch       # Watch mode with hot reload
```

### E2E Tests

```bash
npm run test:e2e:ui      # Playwright UI mode
npx playwright show-trace trace.zip  # View test traces
```

## Production Readiness

This testing infrastructure provides:

- ✅ Comprehensive coverage (>80% target)
- ✅ Multiple test types (unit, integration, E2E)
- ✅ Cross-browser testing
- ✅ Mobile device testing
- ✅ CI/CD ready configuration
- ✅ Error handling and edge case coverage
- ✅ Accessibility testing considerations
- ✅ Performance monitoring capabilities
