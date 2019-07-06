import { Injectable } from '@angular/core';
import { MeetingStateModel } from './meeting';
import { State } from '../../shared/state';
import { UserDto } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class MeetingState extends State<MeetingStateModel> {
  addUser(user: UserDto) {
    this.subject.next({
      ...this.subject.getValue(),
      meeting: {
        ...this.subject.getValue().meeting,
        users: [...this.subject.getValue().meeting.users, user],
      },
    });
  }

  removeUser(userId: number) {
    this.subject.next({
      ...this.subject.getValue(),
      meeting: {
        ...this.subject.getValue().meeting,
        users: [
          ...this.subject.getValue().meeting.users.filter(x => x.id !== userId),
        ],
      },
    });
  }
}
