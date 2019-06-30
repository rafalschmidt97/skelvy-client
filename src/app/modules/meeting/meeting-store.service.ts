import { Injectable } from '@angular/core';
import { MeetingModel, MeetingUserDto } from './meeting';
import { StoreService } from '../../shared/store.service';
import { ChatMessageDto } from '../chat/chat';

@Injectable({
  providedIn: 'root',
})
export class MeetingStoreService extends StoreService<MeetingModel> {
  addUser(user: MeetingUserDto) {
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
