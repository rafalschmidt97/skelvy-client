import { Action, State, StateContext } from '@ngxs/store';
import { ChangeConnectionStatus, SetGlobal } from './global-actions';

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
export class GlobalState {
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
