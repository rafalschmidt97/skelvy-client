import { Action, State, StateContext } from '@ngxs/store';
import {
  ChangeExploreLoadingStatus,
  RemoveExploreMeeting,
  RemoveExploreRequest,
  UpdateExploreState,
} from './explore-actions';
import {
  MeetingDto,
  MeetingRequestDto,
  MeetingRequestWithUserDto,
  MeetingWithUsersDto,
} from '../../meetings/meetings';

export interface ExploreStateModel {
  loading: boolean;
  meetings: MeetingWithUsersDto[];
  requests: MeetingRequestWithUserDto[];
}

@State<ExploreStateModel>({
  name: 'explore',
  defaults: {
    loading: false,
    meetings: [],
    requests: [],
  },
})
export class ExploreState {
  @Action(ChangeExploreLoadingStatus)
  changeExploreLoadingStatus(
    { getState, setState }: StateContext<ExploreStateModel>,
    { status }: ChangeExploreLoadingStatus,
  ) {
    const state = getState();
    setState({
      ...state,
      loading: status,
    });
  }

  @Action(UpdateExploreState)
  updateExplore(
    { getState, setState }: StateContext<ExploreStateModel>,
    { meetings, requests }: UpdateExploreState,
  ) {
    const state = getState();
    setState({
      ...state,
      meetings: meetings,
      requests: requests,
    });
  }

  @Action(RemoveExploreMeeting)
  removeMeeting(
    { getState, setState }: StateContext<ExploreStateModel>,
    { meetingId }: RemoveExploreMeeting,
  ) {
    const state = getState();
    setState({
      ...state,
      meetings: state.meetings.filter(x => x.id !== meetingId),
    });
  }

  @Action(RemoveExploreRequest)
  removeRequest(
    { getState, setState }: StateContext<ExploreStateModel>,
    { requestId }: RemoveExploreRequest,
  ) {
    const state = getState();
    setState({
      ...state,
      requests: state.requests.filter(x => x.id !== requestId),
    });
  }
}
