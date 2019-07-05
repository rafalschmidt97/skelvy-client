import { Injectable } from '@angular/core';
import { State } from '../../shared/state';
import { Connection, GlobalStateModel } from './global';

@Injectable({
  providedIn: 'root',
})
export class GlobalState extends State<GlobalStateModel> {
  connect() {
    this.subject.next({
      ...this.subject.getValue(),
      connection: Connection.CONNECTED,
    });
  }

  reconnect() {
    this.subject.next({
      ...this.subject.getValue(),
      connection: Connection.RECONNECTING,
    });
  }

  waiting() {
    this.subject.next({
      ...this.subject.getValue(),
      connection: Connection.WAITING,
    });
  }

  disconnect() {
    this.subject.next({
      ...this.subject.getValue(),
      connection: Connection.DISCONNECTED,
    });
  }

  markMeetingAsLoading() {
    this.subject.next({
      ...this.subject.getValue(),
      loadingMeeting: true,
    });
  }

  markMeetingAsLoaded() {
    this.subject.next({
      ...this.subject.getValue(),
      loadingMeeting: false,
    });
  }

  markUserAsLoading() {
    this.subject.next({
      ...this.subject.getValue(),
      loadingUser: true,
    });
  }

  markUserAsLoaded() {
    this.subject.next({
      ...this.subject.getValue(),
      loadingUser: false,
    });
  }

  addToRead(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      toRead: this.subject.getValue().toRead + amount,
    });
  }

  setToRead(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      toRead: amount,
    });
  }
}
