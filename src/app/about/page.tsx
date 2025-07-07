export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About ShopEase</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Story</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            ShopEase is a demonstration e-commerce project built with Next.js, TypeScript, and Tailwind CSS. 
            This project serves as a portfolio piece showcasing modern web development techniques and best practices.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The application uses the Fake Store API (https://fakestoreapi.com) to simulate a real e-commerce platform, 
            complete with product listings, shopping cart functionality, and a checkout process.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technologies Used</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Next.js 14 with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>Zustand for state management</li>
            <li>NextAuth.js for authentication</li>
            <li>Axios for API requests</li>
            <li>React Icons for iconography</li>
            <li>Framer Motion for animations</li>
            <li>React Hot Toast for notifications</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Responsive design that works on mobile, tablet, and desktop</li>
            <li>Product browsing with category filtering</li>
            <li>Product detail pages</li>
            <li>Shopping cart with persistent storage</li>
            <li>User authentication (simulated)</li>
            <li>Checkout process (no actual payment processing)</li>
            <li>Toast notifications for user feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
