const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash password for demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  // Seed products - Electronics & Tech
  const products = [
    // Smartphones & Mobile
    {
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. 256GB storage with ProRAW capabilities.',
      price: 1199.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. 512GB storage.',
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Google Pixel 8 Pro',
      description: 'Google flagship with advanced computational photography and pure Android experience. 256GB storage.',
      price: 999.99,
      imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },

    // Audio & Headphones
    {
      name: 'AirPods Pro 2nd Gen',
      description: 'Wireless earbuds with active noise cancellation, spatial audio, and MagSafe charging case.',
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life.',
      price: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Beats Studio Buds',
      description: 'True wireless earbuds with active noise cancelling and powerful sound.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1590658165737-15a047b7a4b8?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },

    // Laptops & Computing
    {
      name: 'MacBook Pro 16" M3',
      description: 'Professional laptop with M3 Max chip, 36GB RAM, and 1TB SSD. Perfect for creative work.',
      price: 2499.99,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Dell XPS 13 Plus',
      description: 'Ultra-thin laptop with 12th Gen Intel Core i7, 16GB RAM, and stunning InfinityEdge display.',
      price: 1199.99,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'ASUS ROG Gaming Laptop',
      description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, and 165Hz display.',
      price: 1899.99,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },

    // Smart Home & Accessories
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity.',
      price: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'iPad Pro 12.9" M2',
      description: 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
      price: 1099.99,
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },

    // Fashion & Apparel
    {
      name: 'Nike Air Jordan 1 Retro',
      description: 'Classic basketball sneakers with premium leather construction and iconic design.',
      price: 189.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },
    {
      name: 'Adidas Ultraboost 22',
      description: 'Premium running shoes with Boost midsole technology and Primeknit upper.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },
    {
      name: 'Levi\'s 501 Original Jeans',
      description: 'Classic straight-leg jeans with authentic fit and timeless style. 100% cotton denim.',
      price: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },
    {
      name: 'Designer Leather Handbag',
      description: 'Elegant leather handbag with multiple compartments and adjustable strap.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },
    {
      name: 'Wool Blend Coat',
      description: 'Premium wool blend coat with classic tailoring and warm insulation.',
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },

    // Home & Living
    {
      name: 'Ergonomic Office Chair',
      description: 'Professional office chair with lumbar support, adjustable height, and breathable mesh.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },
    {
      name: 'Modern Coffee Table',
      description: 'Minimalist coffee table with tempered glass top and solid wood legs.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },
    {
      name: 'Ceramic Table Lamp',
      description: 'Elegant ceramic table lamp with linen shade and warm LED bulb included.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },
    {
      name: 'Throw Pillow Set',
      description: 'Set of 4 decorative throw pillows with premium fabric covers and hypoallergenic filling.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },

    // Kitchen & Appliances
    {
      name: 'Espresso Machine',
      description: 'Professional-grade espresso machine with built-in grinder and milk frother.',
      price: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },
    {
      name: 'Air Fryer',
      description: 'Digital air fryer with 6-quart capacity and 8 preset cooking programs.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },
    {
      name: 'Stainless Steel Cookware Set',
      description: '10-piece stainless steel cookware set with triple-layer base and ergonomic handles.',
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-8d6f01b9e2ba?w=500&h=500&fit=crop',
      category: 'Home',
      inStock: true,
    },

    // Sports & Fitness
    {
      name: 'Yoga Mat Premium',
      description: 'Extra-thick yoga mat with superior grip and eco-friendly materials.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&h=500&fit=crop',
      category: 'Sports',
      inStock: true,
    },
    {
      name: 'Dumbbell Set',
      description: 'Adjustable dumbbell set with quick-change weight system. 5-50 lbs per dumbbell.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
      category: 'Sports',
      inStock: true,
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
      price: 119.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'Sports',
      inStock: true,
    },
    {
      name: 'Resistance Bands Set',
      description: 'Complete resistance bands set with door anchor, handles, and exercise guide.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
      category: 'Sports',
      inStock: true,
    },

    // Beauty & Personal Care
    {
      name: 'Skincare Gift Set',
      description: 'Complete skincare routine with cleanser, serum, moisturizer, and SPF protection.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop',
      category: 'Beauty',
      inStock: true,
    },
    {
      name: 'Hair Styling Tool',
      description: 'Professional hair straightener with ceramic plates and adjustable temperature.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop',
      category: 'Beauty',
      inStock: true,
    },
    {
      name: 'Makeup Palette',
      description: 'Professional makeup palette with 20 eyeshadow shades and premium brushes.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',
      category: 'Beauty',
      inStock: true,
    },
    {
      name: 'Electric Toothbrush',
      description: 'Sonic electric toothbrush with multiple cleaning modes and 2-week battery life.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop',
      category: 'Beauty',
      inStock: true,
    },

    // Books & Media
    {
      name: 'Bestseller Novel Collection',
      description: 'Set of 5 bestselling novels from award-winning authors. Perfect for book lovers.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
      category: 'Books',
      inStock: true,
    },
    {
      name: 'Vintage Vinyl Records',
      description: 'Collection of classic vinyl records from the 70s and 80s. Excellent condition.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      category: 'Books',
      inStock: true,
    },

    // Additional Premium Items
    {
      name: 'Luxury Watch',
      description: 'Swiss-made automatic watch with sapphire crystal and leather strap.',
      price: 799.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Fashion',
      inStock: true,
    },
    {
      name: 'Professional Camera',
      description: 'Mirrorless camera with 24MP sensor, 4K video, and interchangeable lens system.',
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
    {
      name: 'Wireless Charging Station',
      description: '3-in-1 wireless charging station for iPhone, AirPods, and Apple Watch.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
      category: 'Electronics',
      inStock: true,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData,
    });
  }

  // Seed some wishlist items
  const createdProducts = await prisma.product.findMany();
  
  if (createdProducts.length > 0) {
    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: user2.id,
          productId: createdProducts[0].id,
        },
      },
      update: {},
      create: {
        userId: user2.id,
        productId: createdProducts[0].id,
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created users: ${user1.email}, ${user2.email}`);
  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
