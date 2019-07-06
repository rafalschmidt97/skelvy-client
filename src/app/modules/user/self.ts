import { UserDto } from './user';
import { MeetingModel } from '../meeting/meeting';

export interface SelfModel {
  user: UserDto;
  meetingModel: MeetingModel;
}
