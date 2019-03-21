import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../core/toast/toast.service';
import { _ } from '../../core/i18n/translate';
import { UserSocketService } from './user-socket.service';
import { UserPushService } from './user-push.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly userSocket: UserSocketService,
    private readonly userPush: UserPushService,
  ) {}

  resolve(): Observable<User> {
    return this.userService.findUser().pipe(
      tap(user => {
        this.userSocket.connect();
        this.userPush.addUserTopic(user.id);
      }),
      catchError(error => {
        this.authService.logout().then(() => {
          this.routerNavigation.navigateBack(['/home']);
          this.toastService.createError(
            _('A problem occurred while finding the user'),
          );
        });

        return throwError(error);
      }),
    );
  }
}
