import { ProfileDto, UserDto } from '../user/user';

export interface MeetingModel {
  meetings: MeetingDto[];
  groups: GroupDto[];
}

export interface MeetingDto {
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  size: number;
  isHidden: boolean;
  city: string;
  groupId: number;
  activity: ActivityDto;
}

export interface GroupDto {
  id: number;
  users: GroupUserDto[];
  messages: MessageDto[];
}

export interface GroupState {
  id: number;
  users: GroupUserDto[];
  messages: MessageState[];
}

export interface GroupUserDto {
  id: number;
  role: string;
  profile: ProfileDto;
}

export interface MeetingWithUsersDto {
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  size: number;
  isPrivate: boolean;
  isHidden: boolean;
  city: string;
  groupId: number;
  activity: ActivityDto;
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
  activities: ActivityDto[];
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
  activities: ActivityDto[];
  user: UserDto;
}

export interface ActivityDto {
  id: number;
  name: string;
  size: number;
}

export interface MeetingSuggestionsModel {
  meetingRequests: MeetingRequestWithUserDto[];
  meetings: MeetingWithUsersDto[];
}

export interface MeetingRequest {
  date: string;
  latitude: number;
  longitude: number;
  activityId: number;
  size: number;
}

export interface MeetingRequestRequest {
  minDate: string;
  maxDate: string;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  activities: MeetingRequestActivityRequest[];
  description?: string;
}

export interface MeetingRequestActivityRequest {
  id: number;
}

export interface MessageDto {
  id: number;
  type: MessageType;
  date: string;
  text: string;
  action: MessageActionType;
  attachmentUrl: string;
  userId: number;
  groupId: number;
}

export interface MessageRequest {
  type: MessageType;
  text: string;
  attachmentUrl: string;
  action: MessageActionType;
  userId: number;
  groupId: number;
}

export interface MessageState extends MessageRequest {
  id: number;
  type: MessageType;
  date: string;
  text: string;
  attachmentUrl: string;
  action: MessageActionType;
  userId: number;
  groupId: number;
  sending?: boolean;
  failed?: boolean;
}

export enum MessageType {
  RESPONSE = 'response',
  ACTION = 'action',
}

export enum MessageActionType {
  SEEN = 'seen',
  TYPINGON = 'typing_on',
  TYPINGOFF = 'typing_off',
}
