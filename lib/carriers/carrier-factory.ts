import { CarrierCredentials } from './types';
import { FedExClient } from './fedex';
import { UPSClient } from './ups';
import { USPSClient } from './usps';
import { DHLClient } from './dhl';

export class CarrierFactory {
  static createClient(
    carrier: 'fedex' | 'ups' | 'usps' | 'dhl',
    credentials: CarrierCredentials
  ) {
    switch (carrier) {
      case 'fedex':
        return new FedExClient(credentials);
      case 'ups':
        return new UPSClient(credentials);
      case 'usps':
        return new USPSClient(credentials);
      case 'dhl':
        return new DHLClient(credentials);
      default:
        throw new Error(`Unsupported carrier: ${carrier}`);
    }
  }
}