export interface UserDto {
  id: number;
  profile: ProfileDto;
}

export interface ProfileDto {
  name: string;
  birthday: Date;
  gender: Gender;
  photos: ProfilePhotoDto[];
  description: string;
}

export interface ProfilePhotoDto {
  url: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
