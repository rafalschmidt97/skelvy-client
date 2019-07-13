import { SelfUserDto } from './user';
import { MeetingModel } from '../meeting/meeting';

export interface SelfModel {
  user: SelfUserDto;
  meetingModel: MeetingModel;
}
