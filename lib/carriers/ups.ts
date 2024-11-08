import { CarrierCredentials, RateRequest, CarrierRate, PickupRequest, PickupResponse } from './types';

export class UPSClient {
  private credentials: CarrierCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(credentials: CarrierCredentials) {
    this.credentials = credentials;
  }

  private async authenticate(): Promise<void> {
    const response = await fetch(
      'https://wwwcie.ups.com/security/v1/oauth/token',
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
      'https://wwwcie.ups.com/api/rating/v1/Rate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          RateRequest: {
            Request: {
              TransactionReference: {
                CustomerContext: 'Rate Request',
              },
            },
            Shipment: {
              Shipper: {
                Address: {
                  PostalCode: request.origin.postalCode,
                  CountryCode: request.origin.countryCode,
                  StateProvinceCode: request.origin.stateCode,
                  City: request.origin.city,
                },
              },
              ShipTo: {
                Address: {
                  PostalCode: request.destination.postalCode,
                  CountryCode: request.destination.countryCode,
                  StateProvinceCode: request.destination.stateCode,
                  City: request.destination.city,
                },
              },
              Package: request.packages.map(pkg => ({
                PackagingType: {
                  Code: '02', // Customer Supplied Package
                },
                Dimensions: {
                  UnitOfMeasurement: {
                    Code: pkg.dimensionUnit === 'IN' ? 'IN' : 'CM',
                  },
                  Length: pkg.length.toString(),
                  Width: pkg.width.toString(),
                  Height: pkg.height.toString(),
                },
                PackageWeight: {
                  UnitOfMeasurement: {
                    Code: pkg.weightUnit === 'LB' ? 'LBS' : 'KGS',
                  },
                  Weight: pkg.weight.toString(),
                },
              })),
              ShipmentRatingOptions: {
                UserLevelDiscountIndicator: 'TRUE',
              },
            },
          },
        }),
      }
    );

    const data = await response.json();
    
    return data.RateResponse.RatedShipment.map((rate: any) => ({
      serviceType: rate.Service.Code,
      serviceName: this.getServiceName(rate.Service.Code),
      totalAmount: parseFloat(rate.TotalCharges.MonetaryValue),
      currency: rate.TotalCharges.CurrencyCode,
      transitDays: rate.GuaranteedDelivery?.BusinessDaysInTransit || 0,
      guaranteed: !!rate.GuaranteedDelivery,
      estimatedDelivery: this.calculateEstimatedDelivery(rate.GuaranteedDelivery?.BusinessDaysInTransit || 0),
    }));
  }

  private getServiceName(code: string): string {
    const services: Record<string, string> = {
      '01': 'Next Day Air',
      '02': '2nd Day Air',
      '03': 'Ground',
      '12': '3 Day Select',
    };
    return services[code] || 'Unknown Service';
  }

  private calculateEstimatedDelivery(transitDays: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + transitDays);
    return date;
  }

  async schedulePickup(request: PickupRequest): Promise<PickupResponse> {
    await this.ensureAuthenticated();

    const response = await fetch(
      'https://wwwcie.ups.com/api/pickup/v1/pickup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          PickupCreationRequest: {
            RatePickupIndicator: 'Y',
            Shipper: {
              Account: {
                AccountNumber: this.credentials.accountNumber,
              },
            },
            PickupDateInfo: {
              CloseTime: request.closeTime,
              ReadyTime: request.readyTime,
              PickupDate: request.pickupDate,
            },
            PickupAddress: {
              AddressLine: request.location,
            },
            Notification: {
              ConfirmationEmailAddress: '',
              UndeliverableEmailAddress: '',
            },
            PickupPiece: request.packages.map(pkg => ({
              ServiceCode: pkg.serviceType,
              TrackingNumber: pkg.trackingNumber,
              Quantity: '1',
              DestinationCountryCode: 'US',
              ContainerCode: '01',
            })),
          },
        }),
      }
    );

    const data = await response.json();
    
    return {
      confirmationNumber: data.PickupCreationResponse.PRN,
      readyTime: request.readyTime,
      closeTime: request.closeTime,
      status: 'confirmed',
    };
  }
}