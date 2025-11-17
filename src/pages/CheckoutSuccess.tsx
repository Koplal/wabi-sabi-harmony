import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <div className="min-h-screen pt-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl py-20">
          <Card className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="font-serif text-4xl mb-4">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            
            {sessionId && (
              <p className="text-sm text-muted-foreground mb-8">
                Order ID: {sessionId.slice(0, 20)}...
              </p>
            )}

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our team will contact you within 24-48 hours to schedule your installation.
              </p>
              <p className="text-muted-foreground">
                If you have any questions, please don't hesitate to reach out.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Link to="/">
                <Button size="lg">Return Home</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
