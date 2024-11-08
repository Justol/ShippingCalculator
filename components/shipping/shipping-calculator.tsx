"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PackageDetails from "./package-details";
import ShippingOptions from "./shipping-options";
import CarrierSettings from "./carrier-settings";
import { type ShippingDetails, type ShippingOption } from "@/lib/types/shipping";
import { calculateShippingOptions } from "@/lib/shipping-calculator";

export default function ShippingCalculator() {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [activeTab, setActiveTab] = useState("package-details");

  const handleCalculate = (details: ShippingDetails) => {
    setShippingDetails(details);
    const options = calculateShippingOptions(details);
    setShippingOptions(options);
    setActiveTab("shipping-options");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="package-details">Package Details</TabsTrigger>
          <TabsTrigger value="shipping-options" disabled={!shippingDetails}>
            Shipping Options
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="package-details">
          <PackageDetails onCalculate={handleCalculate} />
        </TabsContent>
        <TabsContent value="shipping-options">
          <ShippingOptions options={shippingOptions} />
        </TabsContent>
        <TabsContent value="settings">
          <CarrierSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
}