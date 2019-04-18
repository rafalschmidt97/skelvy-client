import { ProfileDto } from '../user/user';
import { ChatMessageDto } from '../chat/chat';

export interface MeetingModelDto {
  status: MeetingStatus;
  meeting: MeetingDto;
  meetingMessages: ChatMessageDto[];
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
  drink: MeetingDrinkDto;
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
  drinks: MeetingDrinkDto[];
}

export interface MeetingUserDto {
  id: number;
  profile: ProfileDto;
}

export interface MeetingDrinkDto {
  id: number;
  name?: string;
}
