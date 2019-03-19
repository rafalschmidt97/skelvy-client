import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from './chat';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  findMessages(fromDate, toDate): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${
        environment.apiUrl
      }meetings/self/chat?fromDate=${fromDate}&toDate=${toDate}`,
    );
  }
}
