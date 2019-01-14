export interface Profile {
  name: string;
  birthDate: Date;
  gender: Gender;
  photos: string[];
  description: string;
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}
