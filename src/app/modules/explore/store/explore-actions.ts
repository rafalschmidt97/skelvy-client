import {
  MeetingRequestWithUserDto,
  MeetingWithUsersDto,
} from '../../meetings/meetings';

export class ChangeExploreLoadingStatus {
  static readonly type = '[Explore] Change meeting loading status';
  constructor(public status: boolean) {}
}

export class UpdateExploreState {
  static readonly type = '[Explore] Update explore';
  constructor(
    public requests: MeetingRequestWithUserDto[],
    public meetings: MeetingWithUsersDto[],
  ) {}
}

export class RemoveExploreRequest {
  static readonly type = '[Explore] Remove request';
  constructor(public requestId: number) {}
}

export class RemoveExploreMeeting {
  static readonly type = '[Explore] Remove meeting';
  constructor(public meetingId: number) {}
}
