import { Injectable } from '@angular/core';
import { MeetingDto, MeetingRequestDto, MeetingStatus } from '../meeting';
import { UserDto } from '../../user/user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import {
  AddMeetingUser,
  RemoveMeetingUser,
  SetMeeting,
} from './meeting-actions';
import { Observable } from 'rxjs';

export interface MeetingStateModel {
  status: MeetingStatus;
  meeting: MeetingDto;
  request: MeetingRequestDto;
}

@State<MeetingStateModel>({
  name: 'meeting',
  defaults: null,
})
export class MeetingStateRedux {
  @Action(AddMeetingUser)
  addUser(
    { getState, setState }: StateContext<MeetingStateModel>,
    { user }: AddMeetingUser,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        user: [...state.meeting.users, user],
      },
    });
  }

  @Action(RemoveMeetingUser)
  removeUser(
    { getState, setState }: StateContext<MeetingStateModel>,
    { userId }: RemoveMeetingUser,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        user: state.meeting.users.filter(x => x.id !== userId),
      },
    });
  }

  @Action(SetMeeting)
  set({ setState }: StateContext<MeetingStateModel>, { model }: SetMeeting) {
    setState(model);
  }
}

@Injectable({
  providedIn: 'root',
})
export class MeetingState {
  constructor(private readonly store: Store) {}

  addUser(user: UserDto) {
    this.store.dispatch(new AddMeetingUser(user));
  }

  removeUser(userId: number) {
    this.store.dispatch(new RemoveMeetingUser(userId));
  }

  set(model: MeetingStateModel) {
    this.store.dispatch(new SetMeeting(model));
  }

  get data(): MeetingStateModel {
    return this.store.selectSnapshot(state => state.meeting);
  }

  get data$(): Observable<MeetingStateModel> {
    return this.store.select(state => state.meeting);
  }
}
