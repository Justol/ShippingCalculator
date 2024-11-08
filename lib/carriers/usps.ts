import { CarrierCredentials, RateRequest, CarrierRate, PickupRequest, PickupResponse } from './types';

export class USPSClient {
  private credentials: CarrierCredentials;

  constructor(credentials: CarrierCredentials) {
    this.credentials = credentials;
  }

  async getRates(request: RateRequest): Promise<CarrierRate[]> {
    const response = await fetch(
      `https://secure.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=${this.buildRateXML(request)}`,
      {
        method: 'GET',
      }
    );

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const packages = Array.from(xmlDoc.getElementsByTagName('Package'));
    const rates: CarrierRate[] = [];

    packages.forEach(pkg => {
      const postage = pkg.getElementsByTagName('Postage');
      Array.from(postage).forEach(rate => {
        const mailService = rate.getAttribute('CLASSID');
        rates.push({
          serviceType: mailService || '',
          serviceName: this.getServiceName(mailService || ''),
          totalAmount: parseFloat(rate.getElementsByTagName('Rate')[0]?.textContent || '0'),
          currency: 'USD',
          transitDays: this.getTransitDays(mailService || ''),
          guaranteed: this.isGuaranteed(mailService || ''),
          estimatedDelivery: this.calculateEstimatedDelivery(this.getTransitDays(mailService || '')),
        });
      });
    });

    return rates;
  }

  private buildRateXML(request: RateRequest): string {
    return `
      <RateV4Request USERID="${this.credentials.apiKey}">
        ${request.packages.map((pkg, index) => `
          <Package ID="${index}">
            <Service>ALL</Service>
            <ZipOrigination>${request.origin.postalCode}</ZipOrigination>
            <ZipDestination>${request.destination.postalCode}</ZipDestination>
            <Pounds>${Math.floor(pkg.weight)}</Pounds>
            <Ounces>${(pkg.weight % 1) * 16}</Ounces>
            <Container>VARIABLE</Container>
            <Size>REGULAR</Size>
            <Width>${pkg.width}</Width>
            <Length>${pkg.length}</Length>
            <Height>${pkg.height}</Height>
            <Girth>${2 * (pkg.width + pkg.height)}</Girth>
            <Machinable>true</Machinable>
          </Package>
        `).join('')}
      </RateV4Request>
    `;
  }

  private getServiceName(code: string): string {
    const services: Record<string, string> = {
      '0': 'First-Class Mail',
      '1': 'Priority Mail',
      '2': 'Priority Mail Express',
      '3': 'Ground',
    };
    return services[code] || 'Unknown Service';
  }

  private getTransitDays(code: string): number {
    const transitDays: Record<string, number> = {
      '0': 3,
      '1': 2,
      '2': 1,
      '3': 5,
    };
    return transitDays[code] || 3;
  }

  private isGuaranteed(code: string): boolean {
    return code === '2'; // Only Priority Mail Express is guaranteed
  }

  private calculateEstimatedDelivery(transitDays: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + transitDays);
    return date;
  }

  async schedulePickup(request: PickupRequest): Promise<PickupResponse> {
    const response = await fetch(
      `https://secure.shippingapis.com/ShippingAPI.dll?API=CarrierPickupSchedule&XML=${this.buildPickupXML(request)}`,
      {
        method: 'GET',
      }
    );

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const confirmationNumber = xmlDoc.getElementsByTagName('ConfirmationNumber')[0]?.textContent || '';
    
    return {
      confirmationNumber,
      readyTime: request.readyTime,
      closeTime: request.closeTime,
      status: 'confirmed',
    };
  }

  private buildPickupXML(request: PickupRequest): string {
    return `
      <CarrierPickupScheduleRequest USERID="${this.credentials.apiKey}">
        <FirstName>Customer</FirstName>
        <LastName>Service</LastName>
        <FirmName>Shipping Calculator</FirmName>
        <SuiteOrApt></SuiteOrApt>
        <Address2>${request.location}</Address2>
        <Urbanization></Urbanization>
        <City>City</City>
        <State>ST</State>
        <ZIP5>12345</ZIP5>
        <ZIP4></ZIP4>
        <Phone></Phone>
        <Extension></Extension>
        <Package>
          <ServiceType>PriorityMail</ServiceType>
          <Count>1</Count>
        </Package>
        <EstimatedWeight>1</EstimatedWeight>
        <PackageLocation>Front Door</PackageLocation>
        <SpecialInstructions></SpecialInstructions>
      </CarrierPickupScheduleRequest>
    `;
  }
}