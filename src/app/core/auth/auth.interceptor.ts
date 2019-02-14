import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../toast/toast.service';
import { _ } from '../i18n/translate';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
  ) {}

  intercept(
    rawRequest: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.addAuthHeader(rawRequest)).pipe(
      switchMap(bearerRequest => {
        return next.handle(bearerRequest).pipe(
          catchError(error => {
            if (
              error instanceof HttpErrorResponse &&
              error.status === 401 &&
              this.router.url !== '/welcome/sign-in'
            ) {
              this.authService.logout().then(() => {
                this.routerNavigation.navigateBack(['/welcome/sign-in']);
                this.toastService.createError(_('Session expired'));
              });
            }

            return throwError(error);
          }),
        );
      }),
    );
  }

  private async addAuthHeader(
    request: HttpRequest<any>,
  ): Promise<HttpRequest<any>> {
    const session = await this.sessionService.getSession();

    if (session) {
      return (request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${session}`,
        },
      }));
    }

    return request;
  }
}
