import { User } from './user';
import { MeetingDto } from '../meeting/meeting';

export interface SelfModel {
  user: User;
  meetingModel: MeetingDto;
}
