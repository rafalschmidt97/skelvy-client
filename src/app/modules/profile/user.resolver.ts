import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Resolve } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
  ) {}

  resolve(): Observable<User> {
    return this.userService.getUser().pipe(
      catchError(error => {
        this.authService.logout();
        this.routerNavigation.navigateBack(['/welcome/sign-in']).then(() => {
          // TODO: show error message that something went wrong
        });

        return throwError(error);
      }),
    );
  }
}
