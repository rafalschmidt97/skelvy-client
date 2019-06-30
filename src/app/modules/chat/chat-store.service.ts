import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { ChatMessageDto, ChatModel } from './chat';

@Injectable({
  providedIn: 'root',
})
export class ChatStoreService extends StoreService<ChatModel> {
  addMessage(message: ChatMessageDto) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [...this.subject.getValue().messages, message],
    });
  }

  removeMessage(message: ChatMessageDto) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject
          .getValue()
          .messages.filter(x => x.date.getTime() !== message.date.getTime()),
      ],
    });
  }

  setMessages(messages: ChatMessageDto[]) {
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

  setPage(page: number) {
    this.subject.next({
      ...this.subject.getValue(),
      page: page,
    });
  }
}
