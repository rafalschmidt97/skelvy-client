import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../core/toast/toast.service';
import { _ } from '../../core/i18n/translate';
import { UserSocketService } from './user-socket.service';
import { UserPushService } from './user-push.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SelfModel } from './self';
import { SelfService } from './self.service';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SelfResolver implements Resolve<SelfModel> {
  constructor(
    private readonly selfService: SelfService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly userSocket: UserSocketService,
    private readonly userPush: UserPushService,
  ) {}

  resolve(): Observable<SelfModel> {
    return this.selfService.findSelf().pipe(
      tap(() => {
        this.userSocket.connect();
        this.userPush.connect();
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status !== 401) {
          this.authService.logoutWithoutRequest().then(() => {
            this.routerNavigation.navigateBack(['/home']);
            this.toastService.createError(
              _('A problem occurred while finding the user'),
            );
          });
        }

        return throwError(error);
      }),
    );
  }
}
