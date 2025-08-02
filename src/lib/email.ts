// Email service utilities
// This example uses Resend, but you can easily switch to SendGrid or other providers

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface OrderData {
  orderId: number;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderDate: string;
}

// Mock email sending function for development
// Replace with actual email service integration
async function sendEmail(options: EmailOptions) {
  // For development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Mock Email Sent:');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`HTML: ${options.html.substring(0, 200)}...`);
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }

  // Production email sending (implement with your preferred service)
  try {
    // Example for SendGrid:
    // const response = await sgMail.send(options);
    // return { success: true, messageId: response[0].headers['x-message-id'] };

    // Example for Resend:
    // const response = await resend.emails.send(options);
    // return { success: true, messageId: response.id };

    // For now, return mock success
    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}

// Generate order confirmation email HTML
function generateOrderConfirmationHTML(orderData: OrderData): string {
  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Thank you for your purchase!</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #333;">Order Details</h2>
        <p><strong>Order ID:</strong> #${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Date:</strong> ${orderData.orderDate}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #333;">Items Ordered</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right;">
        <h3 style="color: #333; margin: 0;">Total: $${orderData.total.toFixed(2)}</h3>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
        <p>If you have any questions about your order, please contact our support team.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(email: string, orderData: OrderData) {
  const html = generateOrderConfirmationHTML(orderData);
  
  return await sendEmail({
    to: email,
    subject: `Order Confirmation - #${orderData.orderId}`,
    html,
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  });
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome!</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0;">Welcome to Our Store!</h1>
        <p style="color: #666; margin: 10px 0 0 0;">We're excited to have you join us.</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with us. You can now:</p>
        <ul>
          <li>Browse our products</li>
          <li>Add items to your wishlist</li>
          <li>Track your orders</li>
          <li>Receive exclusive offers</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Start Shopping
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
        <p>If you have any questions, feel free to contact our support team.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Our Store!',
    html,
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  });
}
