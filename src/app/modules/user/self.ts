import { UserDto } from './user';
import { MeetingModel } from '../meeting/meeting';

export interface SelfModelDto {
  user: UserDto;
  meetingModel: MeetingModel;
}
