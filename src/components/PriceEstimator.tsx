import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const serviceTypes = [
  { value: "studio", label: "Studio or 1 bedroom", basePrice: 145 },
  { value: "2bed", label: "2 Bedroom Apartment", basePrice: 175 },
  { value: "3bed", label: "3 bedroom Apartment or Townhome", basePrice: 205 },
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
  const [frequency, setFrequency] = useState<string>("onetime");
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  useEffect(() => {
    if (!serviceType) return;

    const service = serviceTypes.find(s => s.value === serviceType);
    if (!service) return;

    let price = service.basePrice;

    // Add bathroom costs (first bathroom is included)
    if (bathrooms > 1) {
      price += (bathrooms - 1) * 20;
    }

    // Apply frequency discount
    const freq = frequencies.find(f => f.value === frequency);
    if (freq && freq.discount > 0) {
      price = price * (1 - freq.discount);
    }

    setEstimatedPrice(Math.round(price));
  }, [serviceType, bathrooms, frequency]);

  return (
    <Card className="p-6 bg-background/95 backdrop-blur-sm">
      <h3 className="font-serif text-2xl mb-6">Get Your Price Estimate</h3>
      
      <div className="space-y-6">
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
          <p className="text-xs text-muted-foreground mt-2">
            First bathroom included, +$20 for each additional
          </p>
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

        {serviceType && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Estimated Price:</span>
              <span className="font-serif text-3xl text-primary">
                ${estimatedPrice}
              </span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link to="/book">Book Now</Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Final price may vary based on home condition and specific requirements
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
