// Allow redux dev tool from remote devices
// Code from: github.com/somq/ionic4-remote-devtool

import {
  NgxsDevtoolsAction,
  NgxsDevtoolsExtension,
} from '@ngxs/devtools-plugin/src/symbols';
import { Subscription } from 'rxjs';
import { connect } from 'remotedev/lib/devTools';
import { environment } from '../../../environments/environment';

class RemoteDevToolsConnectionProxy implements NgxsDevtoolsExtension {
  constructor(public remoteDev: any, public instanceId: string) {}
  init() {}
  error() {}

  subscribe(listener: (change: any) => void): any {
    const listenerWrapper = (change: any) => {
      listener(change);
    };

    this.remoteDev.subscribe(listenerWrapper);
    // Fix for commit/time-travelling etc. if the devtools are already open
    setTimeout(() => listenerWrapper({ type: 'START' }));
  }

  unsubscribe(): any {
    // Fix bug in @ngrx/store-devtools that calls this instead of returning
    // a lambda that calls it when their Observable wrapper is unsubscribed.
    return () => this.remoteDev.unsubscribe(this.instanceId);
  }

  send(action: any, state: any): any {
    this.remoteDev.send(action, state);
  }
}

class RemoteDevToolsProxy implements NgxsDevtoolsExtension {
  remoteDev: any = null;
  defaultOptions = {
    realtime: true,
    // Needs to match what you run `remoteDev` command with and
    // what you setup in remote devtools local connection settings
    hostname: environment.hostname,
    port: 8000,
    autoReconnect: true,
    connectTimeout: 300000,
    ackTimeout: 12000000,
    secure: true,
  };

  constructor(defaultOptions: Object) {
    this.defaultOptions = Object.assign(this.defaultOptions, defaultOptions);
  }

  init(state: any): void {}

  subscribe(fn: (message: NgxsDevtoolsAction) => void): Subscription {
    return undefined;
  }

  connect(options: { shouldStringify?: boolean; instanceId: string }) {
    const connectOptions = Object.assign(this.defaultOptions, options);

    this.remoteDev = connect(connectOptions);

    return new RemoteDevToolsConnectionProxy(
      this.remoteDev,
      connectOptions.instanceId,
    );
  }

  send(action: any, state: any): any {
    this.remoteDev.send(action, state);
  }
}

export function registerReduxDevToolOnDevice() {
  if (!window['devToolsExtension'] && !window['__REDUX_DEVTOOLS_EXTENSION__']) {
    const remoteDevToolsProxy = new RemoteDevToolsProxy({
      connectTimeout: 300000,
      ackTimeout: 120000,
      secure: false,
    });

    // support both the legacy and new keys, for now
    window['devToolsExtension'] = remoteDevToolsProxy;
    window['__REDUX_DEVTOOLS_EXTENSION__'] = remoteDevToolsProxy;
  }
}
