import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import {
  AddChatMessagesToRead,
  ChangeConnectionStatus,
  MarkMeetingAsLoaded,
  MarkMeetingAsLoading,
  MarkUserAsLoaded,
  MarkUserAsLoading,
  SetChatMessagesToRead,
  SetGlobal,
} from './global-actions';
import { Observable } from 'rxjs';

export interface GlobalStateModel {
  connection: Connection;
  toRead: number;
  loadingUser: boolean;
  loadingMeeting: boolean;
}

export enum Connection {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  WAITING = 'waiting',
  DISCONNECTED = 'disconnected',
}

@State<GlobalStateModel>({
  name: 'global',
  defaults: null,
})
export class GlobalStateRedux {
  @Action(ChangeConnectionStatus)
  changeConnectionStatus(
    { getState, setState }: StateContext<GlobalStateModel>,
    { status }: ChangeConnectionStatus,
  ) {
    const state = getState();
    setState({
      ...state,
      connection: status,
    });
  }

  @Action(MarkMeetingAsLoading)
  markMeetingAsLoading({ getState, setState }: StateContext<GlobalStateModel>) {
    const state = getState();
    setState({
      ...state,
      loadingMeeting: true,
    });
  }

  @Action(MarkMeetingAsLoaded)
  markMeetingAsLoaded({ getState, setState }: StateContext<GlobalStateModel>) {
    const state = getState();
    setState({
      ...state,
      loadingMeeting: false,
    });
  }

  @Action(MarkUserAsLoading)
  markUserAsLoading({ getState, setState }: StateContext<GlobalStateModel>) {
    const state = getState();
    setState({
      ...state,
      loadingMeeting: true,
    });
  }

  @Action(MarkUserAsLoaded)
  markUserAsLoaded({ getState, setState }: StateContext<GlobalStateModel>) {
    const state = getState();
    setState({
      ...state,
      loadingMeeting: false,
    });
  }

  @Action(AddChatMessagesToRead)
  addChatMessagesToRead(
    { getState, setState }: StateContext<GlobalStateModel>,
    { amount }: AddChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: state.toRead + amount,
    });
  }

  @Action(SetChatMessagesToRead)
  setChatMessagesToRead(
    { getState, setState }: StateContext<GlobalStateModel>,
    { amount }: SetChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: amount,
    });
  }

  @Action(SetGlobal)
  set({ setState }: StateContext<GlobalStateModel>, { model }: SetGlobal) {
    setState(model);
  }
}

@Injectable({
  providedIn: 'root',
})
export class GlobalState {
  constructor(private readonly store: Store) {}

  connect() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTED));
  }

  reconnect() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.RECONNECTING));
  }

  waiting() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.WAITING));
  }

  disconnect() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.DISCONNECTED));
  }

  markMeetingAsLoading() {
    this.store.dispatch(new MarkMeetingAsLoading());
  }

  markMeetingAsLoaded() {
    this.store.dispatch(new MarkMeetingAsLoaded());
  }

  markUserAsLoading() {
    this.store.dispatch(new MarkUserAsLoading());
  }

  markUserAsLoaded() {
    this.store.dispatch(new MarkUserAsLoaded());
  }

  addToRead(amount: number) {
    this.store.dispatch(new AddChatMessagesToRead(amount));
  }

  setToRead(amount: number) {
    this.store.dispatch(new SetChatMessagesToRead(amount));
  }

  set(model: GlobalStateModel) {
    this.store.dispatch(new SetGlobal(model));
  }

  get data(): GlobalStateModel {
    return this.store.selectSnapshot(state => state.global);
  }

  get data$(): Observable<GlobalStateModel> {
    return this.store.select(state => state.global);
  }
}
