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
import { SyncModel } from './sync';
import { SelfService } from './self.service';
import { AuthService } from '../../core/auth/auth.service';
import { StateTrackerService } from '../../core/state/state-tracker.service';
import { LoadingService } from '../../core/loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class SelfResolver implements Resolve<SyncModel> {
  constructor(
    private readonly selfService: SelfService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly userSocket: UserSocketService,
    private readonly userPush: UserPushService,
    private readonly stateTracker: StateTrackerService,
    private readonly loadingService: LoadingService,
  ) {}

  async resolve(): Promise<SyncModel> {
    const loading = await this.loadingService.show();
    return this.selfService
      .self()
      .pipe(
        tap(async () => {
          this.stateTracker.track();
          this.userSocket.connect();
          await this.userPush.connect();
          await loading.dismiss();
        }),
        catchError(async (error: HttpErrorResponse) => {
          if (error.status !== 401) {
            this.authService.logoutWithoutRequest().then(() => {
              this.routerNavigation.navigateBack(['/home']);
              this.toastService.createError(
                _('A problem occurred while finding the user'),
              );
            });
          }

          await loading.dismiss();
          return throwError(error);
        }),
      )
      .toPromise();
  }
}
