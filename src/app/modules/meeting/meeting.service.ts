import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import {
  ActivityDto,
  MeetingModel,
  MeetingRequestRequest,
  MeetingSuggestionsModel,
} from './meeting';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserDto } from '../user/user';
import { Store } from '@ngxs/store';
import {
  AddGroupUser,
  ChangeMeetingLoadingStatus,
  RemoveGroup,
  RemoveGroupUser,
  RemoveMeeting,
  RemoveRequest,
  UpdateMeetingsFromModel,
} from './store/meeting-actions';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  findMeeting(markedAsLoading: boolean = false): Observable<MeetingModel> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingModel>(
        `${environment.versionApiUrl}meetings/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(model => {
          this.store.dispatch(
            new UpdateMeetingsFromModel(model.meetings, model.groups),
          );
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          // TODO: set not red messages
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  leaveMeeting(meetingId: number, groupId: number): Observable<void> {
    return this.http
      .post<void>(environment.versionApiUrl + 'meetings/self/leave', null)
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveMeeting(meetingId));
          this.store.dispatch(new RemoveGroup(groupId));
          // TODO: remove red messages date
        }),
      );
  }

  createMeetingRequest(request: MeetingRequestRequest): Observable<void> {
    return this.http.post<void>(
      environment.versionApiUrl + 'meetings/self/requests',
      request,
    );
  }

  removeMeetingRequest(requestId: number): Observable<void> {
    return this.http
      .delete<void>(environment.versionApiUrl + 'meetings/self/requests')
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveRequest(requestId));
        }),
      );
  }

  findActivities(): Observable<ActivityDto[]> {
    return this.http.get<ActivityDto[]>(
      environment.versionApiUrl + 'activities',
    );
  }

  findMeetingSuggestions(
    latitude: number,
    longitude: number,
  ): Observable<MeetingSuggestionsModel> {
    return this.http.get<MeetingSuggestionsModel>(
      `${environment.versionApiUrl}meetings/self/suggestions` +
        `?latitude=${latitude}&longitude=${longitude}&language=${this.translateService.currentLang}`,
    );
  }

  joinMeeting(meetingId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}meetings/${meetingId}/join`,
      null,
    );
  }

  connectMeetingRequest(requestId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}self/requests/${requestId}/connect`,
      null,
    );
  }

  findUser(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${environment.versionApiUrl}users/${userId}`,
    );
  }

  addUser(userId: number, groupId: number, role: string): Observable<UserDto> {
    return this.findUser(userId).pipe(
      tap(user => {
        this.store.dispatch(new AddGroupUser(groupId, { ...user, role }));
      }),
    );
  }

  removeUser(userId: number, groupId: number) {
    this.store.dispatch(new RemoveGroupUser(userId, groupId));
  }

  clearMeeting(meetingId: number) {
    this.store.dispatch(new RemoveMeeting(meetingId));
  }

  clearMeetingRequest(requestId: number) {
    this.store.dispatch(new RemoveRequest(requestId));
  }
}
