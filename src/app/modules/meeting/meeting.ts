import { Profile } from '../profile/profile';

export interface Meeting {
  id: number;
  users: MeetingUser[];
  drink: MeetingDrink;
  date: Date;
  address: MeetingAddress;
}

export interface MeetingRequest {
  id: number;
  minimumDate: Date;
  maximumDate: Date;
  address: MeetingAddress;
  drinks: MeetingDrink[];
  minimumAge: number;
  maximumAge: number;
}

export interface MeetingUser {
  id: number;
  profile: Profile;
}

export interface MeetingDrink {
  id: number;
  name: string;
}

export interface MeetingAddress {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}
