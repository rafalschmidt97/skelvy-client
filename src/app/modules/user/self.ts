import { UserDto } from './user';
import { MeetingModelDto } from '../meeting/meeting';

export interface SelfModelDto {
  user: UserDto;
  meetingModel: MeetingModelDto;
}
