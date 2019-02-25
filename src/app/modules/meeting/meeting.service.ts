import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingModel, MeetingRequest } from './meeting';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingStore: MeetingStoreService,
  ) {}

  getMeeting(): Observable<MeetingModel> {
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
      }),
    );
  }

  createMeetingRequest(request: MeetingRequest): Observable<void> {
    return this.http
      .post<void>(environment.apiUrl + 'meetings/requests/self', request)
      .pipe(
        tap(() => {
          this.getMeeting().subscribe();
        }),
      );
  }

  deleteMeetingRequest(): Observable<void> {
    return this.http
      .delete<void>(environment.apiUrl + 'meetings/requests/self')
      .pipe(
        tap(() => {
          this.meetingStore.set(null);
        }),
      );
  }
}
