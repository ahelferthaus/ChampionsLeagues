import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentMethodButtonsProps {
  amount: number;
  description: string;
  onPaymentComplete?: () => void;
}

export function PaymentMethodButtons({ amount, description, onPaymentComplete }: PaymentMethodButtonsProps) {
  const handleStripePayment = () => {
    toast({
      title: "Stripe Payment",
      description: `Demo: Processing $${amount.toFixed(2)} payment for "${description}" via Stripe...`,
    });
    // In a real app, this would redirect to Stripe checkout
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Demo payment completed successfully!",
      });
      onPaymentComplete?.();
    }, 1500);
  };

  const handleVenmoPayment = () => {
    toast({
      title: "Venmo Payment",
      description: `Demo: Opening Venmo for $${amount.toFixed(2)} payment...`,
    });
    // In a real app, this would open Venmo deep link
    setTimeout(() => {
      toast({
        title: "Venmo Request Sent",
        description: "Demo: Check your Venmo app to complete payment!",
      });
    }, 1000);
  };

  return (
    <div className="flex gap-2">
      {/* Stripe Button */}
      <Button 
        size="sm" 
        onClick={handleStripePayment}
        className="bg-[hsl(252,100%,60%)] hover:bg-[hsl(252,100%,50%)] text-primary-foreground gap-1.5"
      >
        <CreditCard className="h-3.5 w-3.5" />
        Pay with Card
      </Button>
      
      {/* Venmo Button */}
      <Button 
        size="sm" 
        onClick={handleVenmoPayment}
        className="bg-[hsl(199,100%,42%)] hover:bg-[hsl(199,100%,35%)] text-primary-foreground gap-1.5"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="h-3.5 w-3.5 fill-current"
          aria-hidden="true"
        >
          <path d="M19.5 3c.9 1.5 1.3 3 1.3 5 0 5.5-4.7 12.6-8.5 17.6H4.7L1.5 3.5l7-.7 1.5 12c1.4-2.3 3.2-5.8 3.2-8.2 0-1.9-.3-3.2-.9-4.2L19.5 3z"/>
        </svg>
        Venmo
      </Button>
    </div>
  );
}
