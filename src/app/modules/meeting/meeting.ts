import { ProfileDto } from '../user/user';
import { ChatMessageDto } from '../chat/chat';

export interface MeetingModelDto {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: ChatMessageDto[];
  request: MeetingRequestDto;
}

export interface MeetingModel {
  status: MeetingStatus;
  meeting: MeetingDto;
  request: MeetingRequestDto;
}

export enum MeetingStatus {
  FOUND = 'found',
  SEARCHING = 'searching',
}

export interface MeetingDto {
  id: number;
  date: Date;
  latitude: number;
  longitude: number;
  city: string;
  drinkType: MeetingDrinkTypeDto;
  users: MeetingUserDto[];
}

export interface MeetingRequestDto {
  id?: number;
  minDate: Date;
  maxDate: Date;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  city: string;
  drinkTypes: MeetingDrinkTypeDto[];
}

export interface MeetingUserDto {
  id: number;
  profile: ProfileDto;
}

export interface MeetingDrinkTypeDto {
  id: number;
  name?: string;
}

export interface MeetingSuggestionsModel {
  meetingRequests: MeetingRequestDto[];
  meetings: MeetingDto[];
}
