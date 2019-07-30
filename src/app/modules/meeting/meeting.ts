import { UserDto } from '../user/user';

export interface MeetingModel {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: MessageDto[];
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
  groupId: number;
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

export interface MeetingRequestWithUserDto {
  id: number;
  minDate: string;
  maxDate: string;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  city: string;
  drinkTypes: MeetingDrinkTypeDto[];
  user: UserDto;
}

export interface MeetingDrinkTypeDto {
  id: number;
  name: string;
}

export interface MeetingSuggestionsModel {
  meetingRequests: MeetingRequestWithUserDto[];
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

export interface MessageDto {
  id: number;
  date: string;
  text: string;
  attachmentUrl: string;
  userId: number;
  groupId: number;
}

export interface MessageState {
  id?: number;
  date: string;
  text: string;
  attachmentUrl: string;
  userId: number;
  groupId: number;
  sending?: boolean;
  failed?: boolean;
}

export interface MessageRequest {
  text: string;
  attachmentUrl: string;
  userId: number;
  groupId: number;
}
