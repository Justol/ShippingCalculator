import { CarrierCredentials, RateRequest, CarrierRate, PickupRequest, PickupResponse } from './types';

export class FedExClient {
  private credentials: CarrierCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(credentials: CarrierCredentials) {
    this.credentials = credentials;
  }

  private async authenticate(): Promise<void> {
    const response = await fetch(
      'https://apis-sandbox.fedex.com/oauth/token',
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
      'https://apis-sandbox.fedex.com/rate/v1/rates/quotes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          accountNumber: {
            value: this.credentials.accountNumber,
          },
          requestedShipment: {
            shipper: {
              address: {
                postalCode: request.origin.postalCode,
                countryCode: request.origin.countryCode,
                stateOrProvinceCode: request.origin.stateCode,
                city: request.origin.city,
              },
            },
            recipient: {
              address: {
                postalCode: request.destination.postalCode,
                countryCode: request.destination.countryCode,
                stateOrProvinceCode: request.destination.stateCode,
                city: request.destination.city,
              },
            },
            requestedPackageLineItems: request.packages.map(pkg => ({
              weight: {
                units: pkg.weightUnit,
                value: pkg.weight,
              },
              dimensions: {
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
                units: pkg.dimensionUnit,
              },
            })),
            shipDateStamp: request.shipmentDate,
          },
        }),
      }
    );

    const data = await response.json();
    
    return data.output.rateReplyDetails.map((rate: any) => ({
      serviceType: rate.serviceType,
      serviceName: rate.serviceName,
      totalAmount: rate.ratedShipmentDetails[0].totalNetChargeWithDutiesAndTaxes,
      currency: rate.currency,
      transitDays: rate.commitDetails[0].transitDays,
      guaranteed: rate.commitDetails[0].committed,
      estimatedDelivery: new Date(rate.commitDetails[0].deliveryTimestamp),
    }));
  }

  async schedulePickup(request: PickupRequest): Promise<PickupResponse> {
    await this.ensureAuthenticated();

    const response = await fetch(
      'https://apis-sandbox.fedex.com/pickup/v1/pickups',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          associatedAccountNumber: {
            value: this.credentials.accountNumber,
          },
          pickupOrigin: {
            pickupLocation: request.location,
          },
          pickupRequestType: 'FUTURE_DAY',
          pickupDate: request.pickupDate,
          readyTimestamp: request.readyTime,
          customerCloseTime: request.closeTime,
          packages: request.packages.map(pkg => ({
            trackingNumber: pkg.trackingNumber,
            serviceType: pkg.serviceType,
            weight: {
              units: 'LB',
              value: pkg.weight,
            },
          })),
        }),
      }
    );

    const data = await response.json();
    
    return {
      confirmationNumber: data.pickupConfirmationNumber,
      readyTime: data.readyTimestamp,
      closeTime: data.customerCloseTime,
      status: data.pickupStatus.toLowerCase(),
    };
  }
}