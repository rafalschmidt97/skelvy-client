import { GroupDto, MeetingDto, MeetingRequestDto } from '../meetings/meetings';
import { FriendInvitation, MeetingInvitation } from './user';

export interface SyncModel {
  requests: MeetingRequestDto[];
  meetings: MeetingDto[];
  groups: GroupDto[];
  friendInvitations: FriendInvitation[];
  meetingInvitations: MeetingInvitation[];
}
