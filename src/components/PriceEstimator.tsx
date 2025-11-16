import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const serviceTypes = [
  { value: "studio", label: "Studio or 1 bedroom", basePrice: 140 },
  { value: "2bed", label: "2 Bedroom Apartment", basePrice: 175 },
  { value: "3bed", label: "3 bedroom Apartment or Townhome", basePrice: 205 },
  { value: "2bed-house", label: "2 bedroom house 1000 sq ft-1700 sq ft", basePrice: 220 },
  { value: "3-4house", label: "3 or 4 bedroom House (1700-1999 sq ft)", basePrice: 235 },
  { value: "2000-2499", label: "Between 2000 and 2499 square feet", basePrice: 265 },
  { value: "2500-2999", label: "Between 2500 and 2999 square feet", basePrice: 295 },
  { value: "3000-3499", label: "Between 3000-3499 square feet", basePrice: 325 },
  { value: "3500-3999", label: "Between 3500-3999 square feet", basePrice: 355 },
  { value: "4000-4499", label: "Between 4000 and 4499 square feet", basePrice: 385 },
  { value: "4500-4999", label: "Between 4500 and 4999 square feet", basePrice: 415 },
  { value: "5000-5499", label: "Between 5000 and 5499 square feet", basePrice: 445 },
  { value: "hourly", label: "One Time Hourly Service", basePrice: 55 },
];

const frequencies = [
  { value: "weekly", label: "Weekly", discount: 0.20 },
  { value: "biweekly", label: "Bi-weekly", discount: 0.15 },
  { value: "triweekly", label: "Tri-weekly", discount: 0.12 },
  { value: "monthly", label: "Monthly", discount: 0.10 },
  { value: "onetime", label: "One-time", discount: 0 },
];

export const PriceEstimator = () => {
  const [serviceType, setServiceType] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [workers, setWorkers] = useState<number>(1);
  const [hours, setHours] = useState<number>(3);
  const [frequency, setFrequency] = useState<string>("onetime");
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isHourlyService = serviceType === "hourly";

  useEffect(() => {
    if (!serviceType) return;

    const service = serviceTypes.find(s => s.value === serviceType);
    if (!service) return;

    let price = service.basePrice;

    if (isHourlyService) {
      // For hourly service, multiply by hours
      price = price * hours;
    } else {
      // Add bathroom costs (first bathroom is included)
      if (bathrooms > 1) {
        price += (bathrooms - 1) * 20;
      }

      // Apply frequency discount
      const freq = frequencies.find(f => f.value === frequency);
      if (freq && freq.discount > 0) {
        price = price * (1 - freq.discount);
      }
    }

    setEstimatedPrice(Math.round(price));
  }, [serviceType, bathrooms, frequency, hours, isHourlyService]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !serviceType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceLabel = serviceTypes.find(s => s.value === serviceType)?.label;
      const frequencyLabel = frequencies.find(f => f.value === frequency)?.label;

      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          firstName,
          lastName,
          email,
          serviceType: serviceLabel,
          bathrooms: isHourlyService ? workers : bathrooms,
          frequency: isHourlyService ? `${hours} hours` : frequencyLabel,
          estimatedPrice
        }
      });

      if (error) throw error;

      toast.success("Booking request sent! We'll contact you shortly.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setServiceType("");
      setBathrooms(1);
      setWorkers(1);
      setHours(3);
      setFrequency("onetime");
    } catch (error) {
      console.error("Error sending booking:", error);
      toast.error("Failed to send booking request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-background/95 backdrop-blur-sm">
      <h3 className="font-serif text-2xl mb-6">Book your peace of mind now</h3>
      
      <form onSubmit={handleBooking} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="mb-2 block">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-2 block">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="service-type" className="mb-2 block">Choose Your Service</Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger id="service-type">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((service) => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isHourlyService ? (
          <>
            <div>
              <Label htmlFor="workers" className="mb-2 block">
                Number of Workers: {workers}
              </Label>
              <Slider
                id="workers"
                min={1}
                max={5}
                step={1}
                value={[workers]}
                onValueChange={(value) => setWorkers(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="hours" className="mb-2 block">
                Number of Hours: {hours}
              </Label>
              <Slider
                id="hours"
                min={3}
                max={8}
                step={0.5}
                value={[hours]}
                onValueChange={(value) => setHours(value[0])}
                className="mt-2"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="bathrooms" className="mb-2 block">
                Number of Bathrooms: {bathrooms}
              </Label>
              <Slider
                id="bathrooms"
                min={1}
                max={5}
                step={1}
                value={[bathrooms]}
                onValueChange={(value) => setBathrooms(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="frequency" className="mb-2 block">Cleaning Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label} {freq.discount > 0 && `(${freq.discount * 100}% off)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {serviceType && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Estimated Price:</span>
              <span className="font-serif text-3xl text-primary">
                ${estimatedPrice}
              </span>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Book Now"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Final price may vary based on home condition and specific requirements
            </p>
          </div>
        )}
      </form>
    </Card>
  );
};
