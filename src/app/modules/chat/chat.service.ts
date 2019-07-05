import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessageDto, ChatMessageRequest } from './chat';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  findMessages(beforeDate: string): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>(
      `${environment.versionApiUrl}meetings/self/chat?beforeDate=${new Date(
        beforeDate,
      ).toISOString()}`,
    );
  }

  sendMessage(message: ChatMessageRequest) {
    return this.http.post<void>(
      environment.versionApiUrl + 'meetings/self/chat',
      message,
    );
  }
}
