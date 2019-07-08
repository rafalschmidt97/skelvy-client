import { Injectable } from '@angular/core';
import {
  ChatMessageState,
  MeetingDto,
  MeetingModel,
  MeetingRequestDto,
  MeetingStatus,
} from '../meeting';
import { UserDto } from '../../user/user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import {
  AddChatMessage,
  AddChatMessagesToRead,
  AddMeetingUser,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  MarkMeetingAsLoaded,
  MarkMeetingAsLoading,
  RemoveChatMessage,
  RemoveMeetingUser,
  RemoveOldAndAddNewChatMessage,
  UpdateChatMessages,
  UpdateChatMessagesToRead,
  UpdateMeeting,
} from './meeting-actions';
import { Observable } from 'rxjs';

export interface MeetingModelState {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: ChatMessageState[];
  request: MeetingRequestDto;
}

export interface MeetingStateModel {
  loading: boolean;
  toRead: number;
  meeting: MeetingModelState;
}

@State<MeetingStateModel>({
  name: 'meeting',
  defaults: {
    loading: false,
    toRead: 0,
    meeting: null,
  },
})
export class MeetingStateRedux {
  @Action(MarkMeetingAsLoading)
  markMeetingAsLoading({
    getState,
    setState,
  }: StateContext<MeetingStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: true,
    });
  }

  @Action(MarkMeetingAsLoaded)
  markMeetingAsLoaded({ getState, setState }: StateContext<MeetingStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: false,
    });
  }

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
        meeting: {
          ...state.meeting.meeting,
          user: [...state.meeting.meeting.users, user],
        },
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
        meeting: {
          ...state.meeting.meeting,
          user: state.meeting.meeting.users.filter(x => x.id !== userId),
        },
      },
    });
  }

  @Action(UpdateMeeting)
  updateMeeting(
    { getState, setState }: StateContext<MeetingStateModel>,
    { model }: UpdateMeeting,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: model,
    });
  }

  @Action(AddChatMessagesToRead)
  addChatMessagesToRead(
    { getState, setState }: StateContext<MeetingStateModel>,
    { amount }: AddChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: state.toRead + amount,
    });
  }

  @Action(UpdateChatMessagesToRead)
  setChatMessagesToRead(
    { getState, setState }: StateContext<MeetingStateModel>,
    { amount }: UpdateChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: amount,
    });
  }

  @Action(AddChatMessage)
  addMessage(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: AddChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: [...state.meeting.messages, message],
      },
    });
  }

  @Action(RemoveChatMessage)
  removeMessage(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: RemoveChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.filter(
          x => new Date(x.date).getTime() !== new Date(message.date).getTime(),
        ),
      },
    });
  }

  @Action(UpdateChatMessages)
  setMessages(
    { getState, setState }: StateContext<MeetingStateModel>,
    { messages }: UpdateChatMessages,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages,
      },
    });
  }

  @Action(RemoveOldAndAddNewChatMessage)
  removeOldAndAddNew(
    { getState, setState }: StateContext<MeetingStateModel>,
    { oldMessage, newMessage }: RemoveOldAndAddNewChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: [
          ...state.meeting.messages.filter(
            x =>
              new Date(x.date).getTime() !==
              new Date(oldMessage.date).getTime(),
          ),
          newMessage,
        ],
      },
    });
  }

  @Action(MarkChatMessageAsSent)
  markAsSent(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: MarkChatMessageAsSent,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = false;
          }

          return x;
        }),
      },
    });
  }

  @Action(MarkChatMessageAsFailed)
  markAsFailed(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: MarkChatMessageAsFailed,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = true;
          }

          return x;
        }),
      },
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class MeetingState {
  constructor(private readonly store: Store) {}

  markAsLoading() {
    this.store.dispatch(new MarkMeetingAsLoading());
  }

  markAsLoaded() {
    this.store.dispatch(new MarkMeetingAsLoaded());
  }

  addToRead(amount: number) {
    this.store.dispatch(new AddChatMessagesToRead(amount));
  }

  setToRead(amount: number) {
    this.store.dispatch(new UpdateChatMessagesToRead(amount));
  }

  addUser(user: UserDto) {
    this.store.dispatch(new AddMeetingUser(user));
  }

  removeUser(userId: number) {
    this.store.dispatch(new RemoveMeetingUser(userId));
  }

  updateMeeting(model: MeetingModel) {
    this.store.dispatch(new UpdateMeeting(model));
  }

  addMessage(message: ChatMessageState) {
    this.store.dispatch(new AddChatMessage(message));
  }

  removeMessage(message: ChatMessageState) {
    this.store.dispatch(new RemoveChatMessage(message));
  }

  updateMessages(messages: ChatMessageState[]) {
    this.store.dispatch(new UpdateChatMessages(messages));
  }

  removeOldAndAddNewMessage(
    oldMessage: ChatMessageState,
    newMessage: ChatMessageState,
  ) {
    this.store.dispatch(
      new RemoveOldAndAddNewChatMessage(oldMessage, newMessage),
    );
  }

  markMessageAsSent(message: ChatMessageState) {
    this.store.dispatch(new MarkChatMessageAsSent(message));
  }

  markMessageAsFailed(message: ChatMessageState) {
    this.store.dispatch(new MarkChatMessageAsFailed(message));
  }

  get data(): MeetingStateModel {
    return this.store.selectSnapshot(state => state.meeting);
  }

  get data$(): Observable<MeetingStateModel> {
    return this.store.select(state => state.meeting);
  }
}
