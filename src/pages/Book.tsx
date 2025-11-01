import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Book = () => {
  const [formData, setFormData] = useState({
    address: "",
    serviceType: "",
    cadence: "",
    preferredTime1: "",
    preferredTime2: "",
    preferredTime3: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: formData
      });

      if (error) throw error;

      toast.success("Booking request received! We'll confirm your appointment shortly.");
      setFormData({
        address: "",
        serviceType: "",
        cadence: "",
        preferredTime1: "",
        preferredTime2: "",
        preferredTime3: ""
      });
    } catch (error) {
      console.error("Error sending booking:", error);
      toast.error("Something went wrong. Please try emailing us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Book Now
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-12 leading-relaxed">
            Begin your journey to a serene, immaculately kept space.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs uppercase tracking-wider">Address</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="rounded-none border-border bg-background"
                placeholder="Full address or neighbourhood"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-xs uppercase tracking-wider">Service Type</Label>
                <Select required value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-maintenance">Residential Maintenance</SelectItem>
                    <SelectItem value="residential-deep">Residential Deep Reset</SelectItem>
                    <SelectItem value="residential-move">Moving Prep / Listing-Ready</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="post-construction">Post-Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cadence" className="text-xs uppercase tracking-wider">Cadence</Label>
                <Select required value={formData.cadence} onValueChange={(value) => setFormData({ ...formData, cadence: value })}>
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

            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-wider">Preferred Time Windows</Label>
              <p className="text-sm text-muted-foreground">Please provide 3 preferred date/time options</p>
              
              <div className="space-y-3">
                <Input
                  placeholder="Option 1 (e.g., Monday, Jan 15, 9am-12pm)"
                  value={formData.preferredTime1}
                  onChange={(e) => setFormData({ ...formData, preferredTime1: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
                <Input
                  placeholder="Option 2"
                  value={formData.preferredTime2}
                  onChange={(e) => setFormData({ ...formData, preferredTime2: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
                <Input
                  placeholder="Option 3"
                  value={formData.preferredTime3}
                  onChange={(e) => setFormData({ ...formData, preferredTime3: e.target.value })}
                  className="rounded-none border-border bg-background"
                />
              </div>
            </div>

            <div className="bg-secondary/30 p-6 rounded-sm">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Final rate will be confirmed after your complimentary walk-through. 
                Most appointments are confirmed within 24 hours.
              </p>
            </div>

            <div className="text-center">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Booking Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Book;
