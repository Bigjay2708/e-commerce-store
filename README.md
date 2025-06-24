# ShopEase - E-Commerce Store

A modern e-commerce store built with Next.js, TypeScript, and Tailwind CSS. This project uses the [Fake Store API](https://fakestoreapi.com) for product data.

## Features

- Modern, responsive UI with Tailwind CSS
- Product listings with category filtering
- Detailed product pages
- Shopping cart functionality
- User authentication (simulated)
- Checkout flow (without actual payment processing)
- Toast notifications for user feedback

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Zustand for state management
- NextAuth.js for authentication
- Axios for API requests
- React Icons
- Framer Motion for animations
- React Hot Toast for notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/e-commerce-store.git
cd e-commerce-store
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API
│   ├── store/           # Zustand store
│   └── types/           # TypeScript type definitions
├── .github/             # GitHub configurations
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Demo Users

For testing the authentication functionality, you can use these demo credentials:

- Username: `johnd` Password: `m38rmF$`
- Username: `mor_2314` Password: `83r5^_`

## Deployment

This project can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fe-commerce-store)

## License

This project is [MIT](LICENSE) licensed.

## Acknowledgements

- [Fake Store API](https://fakestoreapi.com) for providing the product data
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
