export interface CarrierCredentials {
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  accountNumber: string;
  environment: 'test' | 'production';
}

export interface RateRequest {
  origin: {
    postalCode: string;
    countryCode: string;
    stateCode: string;
    city: string;
  };
  destination: {
    postalCode: string;
    countryCode: string;
    stateCode: string;
    city: string;
  };
  packages: Array<{
    weight: number;
    length: number;
    width: number;
    height: number;
    dimensionUnit: 'IN' | 'CM';
    weightUnit: 'LB' | 'KG';
  }>;
  shipmentDate: string;
}

export interface CarrierRate {
  serviceType: string;
  serviceName: string;
  totalAmount: number;
  currency: string;
  transitDays: number;
  guaranteed: boolean;
  estimatedDelivery: Date;
}

export interface PickupRequest {
  pickupDate: string;
  readyTime: string;
  closeTime: string;
  location: string;
  packages: Array<{
    trackingNumber?: string;
    weight: number;
    serviceType: string;
  }>;
}

export interface PickupResponse {
  confirmationNumber: string;
  readyTime: string;
  closeTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}