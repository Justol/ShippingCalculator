export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PackageDimensions {
  length: string;
  width: string;
  height: string;
  weight: string;
}

export interface PackingDetails {
  type: "customer" | "shipping-center";
  boxSize?: "small" | "medium" | "large" | "custom";
  packagingType?: "box" | "bubble-mailer" | "envelope";
  materials?: string[];
  complexity?: "regular" | "fragile" | "veryFragile" | "custom";
}

export interface ShippingDetails {
  shipper: Address;
  receiver: Address;
  package: PackageDimensions;
  packing: PackingDetails;
}

export interface ShippingOption {
  carrier: string;
  service: string;
  price: number;
  estimatedDelivery: Date;
  guaranteed: boolean;
}