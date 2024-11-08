import { type ShippingDetails, type ShippingOption } from "./types/shipping";
import { addDays, addHours } from "date-fns";

// Mock function to calculate distance between ZIP codes
function calculateDistance(fromZip: string, toZip: string): number {
  // In a real implementation, this would use a geocoding service
  // For demo purposes, we'll generate a random distance between 100-1500 miles
  return Math.floor(Math.random() * 1400) + 100;
}

// Calculate packing cost based on selected options
function calculatePackingCost(details: ShippingDetails): number {
  if (details.packing.type === "customer") {
    return 0;
  }

  let cost = 0;

  // Base cost for box sizes
  switch (details.packing.boxSize) {
    case "small":
      cost += 5;
      break;
    case "medium":
      cost += 8;
      break;
    case "large":
      cost += 12;
      break;
    case "custom":
      cost += 15;
      break;
  }

  // Cost for packaging type
  switch (details.packing.packagingType) {
    case "bubble-mailer":
      cost += 3;
      break;
    case "envelope":
      cost += 1;
      break;
  }

  // Additional materials cost
  if (details.packing.materials) {
    const materialCosts: Record<string, number> = {
      "bubble-wrap": 3,
      "packing-peanuts": 4,
      foam: 5,
      tape: 2,
      "corner-protectors": 3,
    };

    details.packing.materials.forEach((material) => {
      cost += materialCosts[material] || 0;
    });
  }

  return cost;
}

// Mock function to calculate base rate
function calculateBaseRate(
  distance: number,
  weight: number,
  dimensions: { length: number; width: number; height: number }
): number {
  const volume = dimensions.length * dimensions.width * dimensions.height;
  const dimensionalWeight = volume / 166; // Standard dimensional weight divisor
  const billableWeight = Math.max(weight, dimensionalWeight);
  
  // Base rate calculation (mock)
  const ratePerMile = 0.1;
  const ratePerPound = 0.5;
  return distance * ratePerMile + billableWeight * ratePerPound;
}

export function calculateShippingOptions(
  details: ShippingDetails
): ShippingOption[] {
  const distance = calculateDistance(
    details.shipper.zipCode,
    details.receiver.zipCode
  );
  
  const baseRate = calculateBaseRate(distance, details.package.weight, {
    length: details.package.length,
    width: details.package.width,
    height: details.package.height,
  });

  const packingCost = calculatePackingCost(details);
  const now = new Date();

  // Generate mock shipping options for each carrier
  const options: ShippingOption[] = [
    // UPS Options
    {
      carrier: "ups",
      service: "Ground",
      price: baseRate * 1.0 + packingCost,
      estimatedDelivery: addDays(now, 5),
      guaranteed: false,
    },
    {
      carrier: "ups",
      service: "3-Day Select",
      price: baseRate * 1.5 + packingCost,
      estimatedDelivery: addDays(now, 3),
      guaranteed: true,
    },
    {
      carrier: "ups",
      service: "2nd Day Air",
      price: baseRate * 2.0 + packingCost,
      estimatedDelivery: addDays(now, 2),
      guaranteed: true,
    },
    {
      carrier: "ups",
      service: "Next Day Air",
      price: baseRate * 3.0 + packingCost,
      estimatedDelivery: addDays(now, 1),
      guaranteed: true,
    },

    // FedEx Options
    {
      carrier: "fedex",
      service: "Ground",
      price: baseRate * 0.95 + packingCost,
      estimatedDelivery: addDays(now, 5),
      guaranteed: false,
    },
    {
      carrier: "fedex",
      service: "Express Saver",
      price: baseRate * 1.4 + packingCost,
      estimatedDelivery: addDays(now, 3),
      guaranteed: true,
    },
    {
      carrier: "fedex",
      service: "2Day",
      price: baseRate * 1.9 + packingCost,
      estimatedDelivery: addDays(now, 2),
      guaranteed: true,
    },
    {
      carrier: "fedex",
      service: "Priority Overnight",
      price: baseRate * 2.8 + packingCost,
      estimatedDelivery: addHours(addDays(now, 1), 10),
      guaranteed: true,
    },

    // USPS Options
    {
      carrier: "usps",
      service: "Retail Ground",
      price: baseRate * 0.8 + packingCost,
      estimatedDelivery: addDays(now, 6),
      guaranteed: false,
    },
    {
      carrier: "usps",
      service: "Priority Mail",
      price: baseRate * 1.2 + packingCost,
      estimatedDelivery: addDays(now, 3),
      guaranteed: false,
    },
    {
      carrier: "usps",
      service: "Priority Mail Express",
      price: baseRate * 2.2 + packingCost,
      estimatedDelivery: addDays(now, 1),
      guaranteed: true,
    },

    // DHL Options
    {
      carrier: "dhl",
      service: "Ground",
      price: baseRate * 0.9 + packingCost,
      estimatedDelivery: addDays(now, 5),
      guaranteed: false,
    },
    {
      carrier: "dhl",
      service: "Express",
      price: baseRate * 1.6 + packingCost,
      estimatedDelivery: addDays(now, 2),
      guaranteed: true,
    },
    {
      carrier: "dhl",
      service: "Same Day",
      price: baseRate * 3.2 + packingCost,
      estimatedDelivery: addHours(now, 24),
      guaranteed: true,
    },
  ];

  return options;
}