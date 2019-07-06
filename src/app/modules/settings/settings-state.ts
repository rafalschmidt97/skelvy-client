import { Injectable } from '@angular/core';
import { State } from '../../shared/state';
import { SettingsStateModel } from './settings';
import { UserDto } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class SettingsState extends State<SettingsStateModel> {
  setBlockedUsers(users: UserDto[]) {
    this.subject.next({
      ...this.subject.getValue(),
      blockedUsers: users,
    });
  }

  addBlockedUsers(users: UserDto[]) {
    this.subject.next({
      ...this.subject.getValue(),
      blockedUsers: [...this.subject.getValue().blockedUsers, ...users],
    });
  }

  addBlockedUser(user: UserDto) {
    this.subject.next({
      ...this.subject.getValue(),
      blockedUsers: [...this.subject.getValue().blockedUsers, user],
    });
  }

  removeBlockedUser(userId: number) {
    this.subject.next({
      ...this.subject.getValue(),
      blockedUsers: [
        ...this.subject.getValue().blockedUsers.filter(x => x.id !== userId),
      ],
    });
  }
}
