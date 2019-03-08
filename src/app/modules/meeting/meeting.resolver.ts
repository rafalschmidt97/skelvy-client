import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from '../../core/toast/toast.service';
import { _ } from '../../core/i18n/translate';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingService } from './meeting.service';
import { MeetingModel } from './meeting';
import { AuthService } from '../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { MeetingHubService } from './meeting-hub.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingResolver implements Resolve<MeetingModel> {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly toastService: ToastService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly meetingHub: MeetingHubService,
  ) {}

  resolve(): Observable<MeetingModel> {
    return this.meetingService.findMeeting().pipe(
      tap(() => {
        this.meetingHub.connect();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.authService.logout().then(() => {
            this.routerNavigation.navigateBack(['/home']);
            this.toastService.createError(
              _('A problem occurred while finding the meeting'),
            );
          });

          return throwError(error);
        }

        return of(null);
      }),
    );
  }
}
