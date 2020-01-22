import { MeetingWithUsersDto } from '../meetings/meetings';

export interface UserDto {
  id: number;
  name: string;
  profile: ProfileDto;
}

export interface ProfileDto {
  name: string;
  age: number;
  gender: Gender;
  photos: ProfilePhotoDto[];
  description: string;
}

export interface SelfUserDto {
  id: number;
  name: string;
  email: string;
  profile: SelfProfileDto;
}

export interface SelfProfileDto {
  name: string;
  birthday: string;
  gender: Gender;
  photos: ProfilePhotoDto[];
  description: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface ProfilePhotoDto {
  url: string;
}

export interface ProfileRequest {
  name: string;
  birthday: string;
  gender: Gender;
  photos: ProfilePhotoDto[];
  description: string;
}

export interface FriendInvitation {
  id: number;
  invitingUser: UserDto;
  createdAt: string;
}

export interface MeetingInvitation {
  id: number;
  invitingUserId: number;
  meeting: MeetingWithUsersDto;
  createdAt: string;
}

export interface MeetingInvitationDetails {
  id: number;
  invitingUserId: number;
  invitedUser: UserDto;
  createdAt: string;
}

export enum RelationType {
  FRIEND = 'friend',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export interface RelationDto {
  userId: number;
  relatedUserId: number;
  type: RelationType;
}
