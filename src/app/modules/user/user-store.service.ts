import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { Connection, UserDto, UserModel } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService extends StoreService<UserModel> {
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

  disconnect() {
    this.subject.next({
      ...this.subject.getValue(),
      connection: Connection.DISCONNECTED,
    });
  }

  setUser(user: UserDto) {
    this.subject.next({
      ...this.subject.getValue(),
      id: user.id,
      profile: user.profile,
    });
  }
}
