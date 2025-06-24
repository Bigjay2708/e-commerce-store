import { useOrderSummary } from '@/hooks/useOrderSummary';

interface OrderSummaryProps {
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ className = '' }) => {
  const summary = useOrderSummary();
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">
          {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">${summary.tax.toFixed(2)}</span>
      </div>
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
