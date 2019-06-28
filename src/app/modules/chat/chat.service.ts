import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessageDto } from './chat';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  findMessages(page: number = 1): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>(
      `${environment.versionApiUrl}meetings/self/chat?page=${page}`,
    );
  }

  sendMessage(message: any) {
    return this.http.post<void>(
      environment.versionApiUrl + 'meetings/self/chat',
      message,
    );
  }
}
