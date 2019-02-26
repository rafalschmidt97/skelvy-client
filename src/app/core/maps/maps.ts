export interface MapsResponse {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city: string;
  type: MapsResponseType;
}

export enum MapsResponseType {
  LOCALITY = 'Locality',
  ADMINISTRATIVE_AREA_LEVEL_1 = 'AdministrativeAreaLevel1',
  ADMINISTRATIVE_AREA_LEVEL_2 = 'AdministrativeAreaLevel2',
  ADMINISTRATIVE_AREA_LEVEL_3 = 'AdministrativeAreaLevel3',
}
