import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../core/toast/toast.service';
import { _ } from '../../core/i18n/translate';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingService } from './meeting.service';
import { MeetingModel } from './meeting';

@Injectable({
  providedIn: 'root',
})
export class MeetingResolver implements Resolve<MeetingModel> {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly toastService: ToastService,
  ) {}

  resolve(): Observable<MeetingModel> {
    return this.meetingService.getMeeting().pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.toastService.createError(_('Something went wrong'));
        }

        return throwError(error);
      }),
    );
  }
}
