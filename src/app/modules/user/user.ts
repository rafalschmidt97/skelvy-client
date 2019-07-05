export interface UserStateModel {
  id: number;
  profile: ProfileDto;
}

export interface UserDto {
  id: number;
  profile: ProfileDto;
}

export interface ProfileDto {
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
