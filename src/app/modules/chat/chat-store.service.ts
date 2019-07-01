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
          .messages.filter(
            x =>
              new Date(x.date).getTime() !== new Date(message.date).getTime(),
          ),
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
      toRead: this.subject.getValue().toRead + amount,
    });
  }

  setToRead(amount: number) {
    this.subject.next({
      ...this.subject.getValue(),
      toRead: amount,
    });
  }

  markAsSending(message: ChatMessageDto) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject.getValue().messages.filter(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = true;
            x.failed = false;
          }

          return x;
        }),
      ],
    });
  }

  markAsSent(message: ChatMessageDto) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject.getValue().messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = false;
          }

          return x;
        }),
      ],
    });
  }

  markAsFailed(message: ChatMessageDto) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject.getValue().messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = true;
          }

          return x;
        }),
      ],
    });
  }
}
