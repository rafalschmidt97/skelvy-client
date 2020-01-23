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
  description: string;
  isHidden: boolean;
  city: string;
  groupId: number;
  activity: ActivityDto;
}

export interface GroupDto {
  id: number;
  name: string;
  users: GroupUserDto[];
  messages: MessageDto[];
  createdAt: string;
}

export interface GroupState {
  id: number;
  name: string;
  users: GroupUserDto[];
  messages: MessageState[];
  createdAt: string;
}

export interface GroupUserDto {
  id: number;
  role: GroupUserRole;
  name: string;
  profile: ProfileDto;
}

export enum GroupUserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  PRIVILEGED = 'privileged',
  MEMBER = 'member',
}

export interface MeetingWithUsersDto {
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  description: string;
  name: string;
  city: string;
  groupId: number;
  activity: ActivityDto;
  users: GroupUserDto[];
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
  description: string;
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
  description: string;
  isHidden: boolean;
}

export interface GroupRequest {
  name: string;
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

export interface ConnectRequest {
  date: string;
  activityId: number;
}
