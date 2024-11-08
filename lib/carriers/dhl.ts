import { CarrierCredentials, RateRequest, CarrierRate, PickupRequest, PickupResponse } from './types';

export class DHLClient {
  private credentials: CarrierCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(credentials: CarrierCredentials) {
    this.credentials = credentials;
  }

  private async authenticate(): Promise<void> {
    const response = await fetch(
      'https://api-sandbox.dhl.com/auth/v4/accesstoken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.credentials.clientId!,
          client_secret: this.credentials.clientSecret!,
        }),
      }
    );

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || this.tokenExpiry < new Date()) {
      await this.authenticate();
    }
  }

  async getRates(request: RateRequest): Promise<CarrierRate[]> {
    await this.ensureAuthenticated();

    const response = await fetch(
      'https://api-sandbox.dhl.com/rates/v4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          customerDetails: {
            shipperDetails: {
              postalCode: request.origin.postalCode,
              cityName: request.origin.city,
              countryCode: request.origin.countryCode,
              provinceCode: request.origin.stateCode,
            },
            receiverDetails: {
              postalCode: request.destination.postalCode,
              cityName: request.destination.city,
              countryCode: request.destination.countryCode,
              provinceCode: request.destination.stateCode,
            },
          },
          plannedShippingDateAndTime: request.shipmentDate,
          unitOfMeasurement: request.packages[0].weightUnit === 'KG' ? 'metric' : 'imperial',
          packages: request.packages.map(pkg => ({
            weight: pkg.weight,
            dimensions: {
              length: pkg.length,
              width: pkg.width,
              height: pkg.height,
            },
          })),
          accountNumber: this.credentials.accountNumber,
        }),
      }
    );

    const data = await response.json();
    
    return data.products.map((product: any) => ({
      serviceType: product.productCode,
      serviceName: product.productName,
      totalAmount: product.totalPrice,
      currency: product.currency,
      transitDays: product.deliveryCapabilities.estimatedDeliveryDays,
      guaranteed: product.deliveryCapabilities.deliveryTypeCode === 'TD',
      estimatedDelivery: new Date(product.deliveryCapabilities.estimatedDeliveryDate),
    }));
  }

  async schedulePickup(request: PickupRequest): Promise<PickupResponse> {
    await this.ensureAuthenticated();

    const response = await fetch(
      'https://api-sandbox.dhl.com/pickup/v4/pickups',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          customerDetails: {
            accountNumber: this.credentials.accountNumber,
          },
          pickupDetails: {
            pickupDate: request.pickupDate,
            readyByTime: request.readyTime,
            closeTime: request.closeTime,
            location: request.location,
          },
          shipmentDetails: request.packages.map(pkg => ({
            trackingNumber: pkg.trackingNumber,
            productCode: pkg.serviceType,
            weight: pkg.weight,
          })),
        }),
      }
    );

    const data = await response.json();
    
    return {
      confirmationNumber: data.dispatchConfirmationNumber,
      readyTime: data.pickupDetails.readyByTime,
      closeTime: data.pickupDetails.closeTime,
      status: data.status.toLowerCase(),
    };
  }
}