import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../core/toast/toast.service';
import { _ } from '../../core/i18n/translate';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingService } from './meeting.service';
import { MeetingModel } from './meeting';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MeetingResolver implements Resolve<MeetingModel> {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly toastService: ToastService,
    private readonly routerNavigation: NavController,
  ) {}

  resolve(): Observable<MeetingModel> {
    return this.meetingService.findMeeting().pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 && error.status !== 404) {
          this.routerNavigation.navigateBack(['/home']);
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );

          return throwError(error);
        }

        return of(null);
      }),
    );
  }
}
