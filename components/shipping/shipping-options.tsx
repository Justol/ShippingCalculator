"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ShippingOption } from "@/lib/types/shipping";
import { cn } from "@/lib/utils";

const carriers = [
  { id: "ups", label: "UPS" },
  { id: "fedex", label: "FedEx" },
  { id: "usps", label: "USPS" },
  { id: "dhl", label: "DHL" },
];

const sortOptions = [
  { value: "price-asc", label: "Lowest Price" },
  { value: "price-desc", label: "Highest Price" },
  { value: "date-asc", label: "Earliest Delivery" },
  { value: "date-desc", label: "Latest Delivery" },
];

interface ShippingOptionsProps {
  options: ShippingOption[];
}

export default function ShippingOptions({ options }: ShippingOptionsProps) {
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(
    carriers.map((c) => c.id)
  );
  const [sortBy, setSortBy] = useState("price-asc");

  const handleCarrierToggle = (carrierId: string) => {
    setSelectedCarriers((prev) =>
      prev.includes(carrierId)
        ? prev.filter((id) => id !== carrierId)
        : [...prev, carrierId]
    );
  };

  const filteredAndSortedOptions = options
    .filter((option) => selectedCarriers.includes(option.carrier))
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-asc":
          return a.estimatedDelivery.getTime() - b.estimatedDelivery.getTime();
        case "date-desc":
          return b.estimatedDelivery.getTime() - a.estimatedDelivery.getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="space-y-4">
          <h3 className="font-semibold">Carriers</h3>
          <div className="flex flex-wrap gap-4">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="flex items-center space-x-2">
                <Checkbox
                  id={carrier.id}
                  checked={selectedCarriers.includes(carrier.id)}
                  onCheckedChange={() => handleCarrierToggle(carrier.id)}
                />
                <label
                  htmlFor={carrier.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {carrier.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAndSortedOptions.map((option) => (
          <Card
            key={`${option.carrier}-${option.service}`}
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <h4 className="font-semibold">
                    {option.carrier.toUpperCase()} - {option.service}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery:{" "}
                  {format(option.estimatedDelivery, "PPP 'by' p")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${option.price.toFixed(2)}</p>
                <p
                  className={cn(
                    "text-sm",
                    option.guaranteed
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  )}
                >
                  {option.guaranteed ? "Guaranteed" : "Estimated"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}