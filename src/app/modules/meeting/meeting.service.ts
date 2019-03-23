import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingDrink, MeetingModel, MeetingRequest } from './meeting';
import { ChatStoreService } from '../chat/chat-store.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
  ) {}

  findMeeting(): Observable<MeetingModel> {
    return this.http
      .get<MeetingModel>(environment.apiUrl + 'meetings/self')
      .pipe(
        tap(meeting => {
          this.meetingStore.set(meeting);
        }),
      );
  }

  leaveMeeting(): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + 'meetings/self').pipe(
      tap(() => {
        this.meetingStore.set(null);
        this.chatStore.set(null);
        this.storage.remove('lastMessageDate');
      }),
    );
  }

  createMeetingRequest(request: MeetingRequest): Observable<void> {
    return this.http.post<void>(
      environment.apiUrl + 'meetings/requests/self',
      request,
    );
  }

  removeMeetingRequest(): Observable<void> {
    return this.http
      .delete<void>(environment.apiUrl + 'meetings/requests/self')
      .pipe(
        tap(() => {
          this.meetingStore.set(null);
        }),
      );
  }

  findDrinks(): Observable<MeetingDrink[]> {
    return this.http.get<MeetingDrink[]>(environment.apiUrl + 'drinks');
  }
}
