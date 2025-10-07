import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    cadence: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll reply within one business day.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      serviceType: "",
      cadence: "",
      notes: ""
    });
  };

  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Contact
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-12 leading-relaxed">
            Let's discuss how we can care for your space.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs uppercase tracking-wider">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs uppercase tracking-wider">Address / Neighbourhood</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-xs uppercase tracking-wider">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="post-construction">Post-Construction</SelectItem>
                    <SelectItem value="consultation">Consultation Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cadence" className="text-xs uppercase tracking-wider">Ideal Cadence</Label>
                <Select value={formData.cadence} onValueChange={(value) => setFormData({ ...formData, cadence: value })}>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="one-time">One-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs uppercase tracking-wider">Notes</Label>
              <Textarea
                id="notes"
                rows={5}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="rounded-none border-border bg-background resize-none"
                placeholder="Tell us about your space, any specific needs, or questions..."
              />
            </div>

            <div className="text-center">
              <Button type="submit" size="lg">
                Send Inquiry
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                We'll reply within one business day.
              </p>
            </div>
          </form>

          <div className="text-center border-t border-border pt-12">
            <p className="text-muted-foreground mb-2">Or reach us directly:</p>
            <a
              href="mailto:hello@wabisabiservices.com"
              className="text-lg hover:text-primary transition-colors"
            >
              hello@wabisabiservices.com
            </a>
            <p className="text-sm text-muted-foreground mt-6">Victoria, BC</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
