import { Profile } from '../profile/user';

export interface MeetingModel {
  status: MeetingStatus;
  meeting: Meeting;
  request: MeetingRequest;
}

export enum MeetingStatus {
  FOUND = 'found',
  SEARCHING = 'searching',
}

export interface Meeting {
  id: number;
  date: Date;
  latitude: number;
  longitude: number;
  drink: MeetingDrink;
  users: MeetingUser[];
}

export interface MeetingRequest {
  id: number;
  minDate: Date;
  maxDate: Date;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  drinks: MeetingDrink[];
}

export interface MeetingUser {
  id: number;
  profile: Profile;
}

export interface MeetingDrink {
  id: number;
  name: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city: string;
  type: LocationType;
}

export enum LocationType {
  LOCALITY = 'Locality',
  ADMINISTRATIVE_AREA_LEVEL_1 = 'AdministrativeAreaLevel1',
  ADMINISTRATIVE_AREA_LEVEL_2 = 'AdministrativeAreaLevel2',
  ADMINISTRATIVE_AREA_LEVEL_3 = 'AdministrativeAreaLevel3',
}
