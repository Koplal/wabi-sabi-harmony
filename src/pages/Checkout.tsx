import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Create Stripe payment intent via edge function
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: total,
          customerInfo: formData,
          items: items.map(item => ({
            name: item.name,
            price: item.price,
          })),
        },
      });

      if (error) throw error;

      // In a real implementation, you would redirect to Stripe Checkout here
      // For now, we'll simulate a successful payment
      toast.success("Order placed successfully! You'll receive a confirmation email shortly.");
      
      // Send confirmation email
      await supabase.functions.invoke('send-booking-email', {
        body: {
          ...formData,
          serviceType: items.map(i => i.name).join(', '),
          estimatedPrice: total,
        },
      });

      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen pt-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="font-serif text-5xl mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <h2 className="font-serif text-3xl mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Installation Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-serif">${item.price}</span>
                      </div>
                    ))}
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-2xl font-serif">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    By placing your order, you agree to our Terms of Service
                  </p>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
