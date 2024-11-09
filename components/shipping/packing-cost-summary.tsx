"use client";

import { PackingDetails } from "@/lib/types/shipping";
import { Card } from "@/components/ui/card";
import { PackageIcon } from "lucide-react";

const MATERIAL_COSTS = {
  "bubble-wrap": { price: 3, label: "Bubble Wrap" },
  "packing-peanuts": { price: 4, label: "Packing Peanuts" },
  foam: { price: 5, label: "Foam Padding" },
  tape: { price: 2, label: "Packing Tape" },
  "corner-protectors": { price: 3, label: "Corner Protectors" },
};

const BOX_COSTS = {
  small: { price: 5, label: "Small Box (12\" x 12\" x 12\")" },
  medium: { price: 8, label: "Medium Box (18\" x 18\" x 18\")" },
  large: { price: 12, label: "Large Box (24\" x 24\" x 24\")" },
  custom: { price: 15, label: "Custom Size Box" },
};

const PACKAGING_COSTS = {
  box: { price: 0, label: "Cardboard Box" },
  "bubble-mailer": { price: 3, label: "Bubble Mailer" },
  envelope: { price: 1, label: "Shipping Envelope" },
};

const LABOR_COSTS = {
  regular: { price: 0, label: "Regular Packaging" },
  fragile: { price: 50, label: "Fragile Items" },
  veryFragile: { price: 150, label: "Very Fragile Items" },
  custom: { price: 100, label: "Custom Packaging" },
};

interface PackingCostSummaryProps {
  packingDetails: PackingDetails;
}

export default function PackingCostSummary({
  packingDetails,
}: PackingCostSummaryProps) {
  if (packingDetails.type !== "shipping-center") {
    return null;
  }

  let totalCost = 0;
  const costBreakdown: { label: string; price: number }[] = [];

  // Add labor cost based on complexity
  if (packingDetails.complexity && LABOR_COSTS[packingDetails.complexity]) {
    const laborCost = LABOR_COSTS[packingDetails.complexity];
    totalCost += laborCost.price;
    costBreakdown.push({
      label: laborCost.label,
      price: laborCost.price,
    });
  }

  // Add box cost if selected
  if (packingDetails.boxSize && BOX_COSTS[packingDetails.boxSize]) {
    const boxCost = BOX_COSTS[packingDetails.boxSize];
    totalCost += boxCost.price;
    costBreakdown.push({
      label: boxCost.label,
      price: boxCost.price,
    });
  }

  // Add packaging type cost if selected
  if (packingDetails.packagingType && PACKAGING_COSTS[packingDetails.packagingType]) {
    const packagingCost = PACKAGING_COSTS[packingDetails.packagingType];
    if (packagingCost.price > 0) {
      totalCost += packagingCost.price;
      costBreakdown.push({
        label: packagingCost.label,
        price: packagingCost.price,
      });
    }
  }

  // Add material costs
  packingDetails.materials?.forEach((materialId) => {
    if (MATERIAL_COSTS[materialId]) {
      const materialCost = MATERIAL_COSTS[materialId];
      totalCost += materialCost.price;
      costBreakdown.push({
        label: materialCost.label,
        price: materialCost.price,
      });
    }
  });

  return (
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center gap-2 mb-3">
        <PackageIcon className="h-5 w-5" />
        <h4 className="font-semibold">Packing Service Cost Summary</h4>
      </div>
      <div className="space-y-2">
        {costBreakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total Packing Cost</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}