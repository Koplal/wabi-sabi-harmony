import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const { items, total, clearCart, isLoaded } = useCart();
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

  const isCartEmpty = items.length === 0;

  useEffect(() => {
    if (isLoaded && isCartEmpty) {
      navigate('/cart', { replace: true });
    }
  }, [isLoaded, isCartEmpty, navigate]);

  // Browser Back from Stripe can restore this page with its state intact, including the spinner.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsProcessing(false);
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Create Stripe Checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.id })),
          customerInfo: formData,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url) {
        console.error('Checkout error:', response.status, data);
        toast.error(data?.error ?? "There was an error creating the checkout session. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("There was an error creating the checkout session. Please try again.");
      setIsProcessing(false);
    }
  };

  const seo = <SEO title="Checkout" description="Complete your seasonal service request." noindex />;

  if (isCartEmpty) {
    return <Layout>{seo}</Layout>;
  }

  return (
    <Layout>
      {seo}
      <div className="min-h-screen pt-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="font-serif text-5xl mb-8">Checkout</h1>

          <div data-clarity-mask="true">
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
                        <Label htmlFor="address">Service Address *</Label>
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
                          <span>Before GST</span>
                          <span>${total}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">5% GST is added at checkout, on the next step.</p>
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
                        'Confirm'
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      By confirming, you agree to our Terms of Service
                    </p>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
