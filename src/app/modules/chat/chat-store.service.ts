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

  setMessages(messages: ChatMessage[]) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: messages,
    });
  }

  addToRead(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      messagesToRead: this.subject.getValue().messagesToRead + amount,
    });
  }

  setToRead(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      messagesToRead: amount,
    });
  }
}
