import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { ChatMessage, ChatModel } from './chat';

@Injectable({
  providedIn: 'root',
})
export class ChatStoreService extends StoreService<ChatModel> {
  addMessage(message: ChatMessage) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [...this.subject.getValue().messages, message],
    });
  }

  setSeen(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      messagesSeen: amount,
    });
  }
}
