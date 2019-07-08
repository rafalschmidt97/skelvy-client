import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { ChangeConnectionStatus, SetGlobal } from './global-actions';
import { Observable } from 'rxjs';

export interface GlobalStateModel {
  connection: Connection;
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
  defaults: {
    connection: Connection.DISCONNECTED,
  },
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

  markConnectionAsConnecting() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTING));
  }

  markConnectionAsConnected() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTED));
  }

  markConnectionAsReconnecting() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.RECONNECTING));
  }

  markConnectionAsWaiting() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.WAITING));
  }

  markConnectionAsDisconnected() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.DISCONNECTED));
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
