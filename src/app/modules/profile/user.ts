export interface User {
  id: number;
  profile: Profile;
}

export interface Profile {
  name: string;
  birthday: Date;
  gender: Gender;
  photos: ProfilePhoto[];
  description: string;
}

export interface ProfilePhoto {
  url: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
