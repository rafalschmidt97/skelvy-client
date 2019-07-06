import { ProfileDto, UserDto } from '../user/user';
import { ChatMessageDto } from '../chat/chat';

export interface MeetingStateModel {
  status: MeetingStatus;
  meeting: MeetingDto;
  request: MeetingRequestDto;
}

export interface MeetingModel {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: ChatMessageDto[];
  request: MeetingRequestDto;
}

export enum MeetingStatus {
  FOUND = 'found',
  SEARCHING = 'searching',
}

export interface MeetingDto {
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  city: string;
  drinkType: MeetingDrinkTypeDto;
  users: UserDto[];
}

export interface MeetingRequestDto {
  id: number;
  minDate: string;
  maxDate: string;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  city: string;
  drinkTypes: MeetingDrinkTypeDto[];
}

export interface MeetingDrinkTypeDto {
  id: number;
  name: string;
}

export interface MeetingSuggestionsModel {
  meetingRequests: MeetingRequestDto[];
  meetings: MeetingDto[];
}

export interface MeetingRequestRequest {
  minDate: string;
  maxDate: string;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  drinkTypes: MeetingRequestDrinkTypeRequest[];
}

export interface MeetingRequestDrinkTypeRequest {
  id: number;
}
