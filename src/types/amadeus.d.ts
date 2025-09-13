declare module 'amadeus' {
  export default class Amadeus {
    constructor(config: { clientId: string; clientSecret: string });
    
    referenceData: {
      locations: {
        get(params: { keyword: string; subType: any }): Promise<{
          data: Array<{
            address: {
              cityCode: string;
            };
          }>;
        }>;
      };
    };
    
    shopping: {
      hotelOffers: {
        get(params: {
          cityCode?: string;
          hotelIds?: string;
          checkInDate?: string;
          checkOutDate?: string;
          roomQuantity?: number;
          adults?: number;
          radius?: number;
          radiusUnit?: string;
          paymentPolicy?: string;
          includeClosed?: boolean;
          bestRateOnly?: boolean;
          view?: string;
          sort?: string;
        }): Promise<{
          data: Array<{
            hotel: {
              hotelId: string;
              name: string;
              rating?: number;
              reviewCount?: number;
              address: {
                lines: string[];
                cityName: string;
                countryCode: string;
              };
              geoCode: {
                latitude: string;
                longitude: string;
              };
              amenities?: string[];
              media?: Array<{
                uri: string;
              }>;
              contact?: {
                website?: string;
              };
            };
            offers: Array<{
              price: {
                total: string;
                currency: string;
              };
            }>;
          }>;
        }>;
      };
    };
    
    static location: {
      city: string;
    };
  }
}
