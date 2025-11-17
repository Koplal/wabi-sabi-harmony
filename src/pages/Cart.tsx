import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, removeFromCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="font-serif text-4xl mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our seasonal packages and add some to your cart
            </p>
            <Button asChild size="lg">
              <Link to="/seasoning">Browse Seasonal Services</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="font-serif text-5xl mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl mb-2">{item.name}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-serif">${item.price}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-serif">${total}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Installation</span>
                    <span className="font-serif">Included</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-2xl font-serif">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/seasoning">Continue Shopping</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
