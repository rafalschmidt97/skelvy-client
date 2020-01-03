import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../toast/toast.service';
import { _ } from '../i18n/translate';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
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
              !bearerRequest.url.includes('auth/facebook') &&
              !bearerRequest.url.includes('auth/google')
            ) {
              if (bearerRequest.url.includes('auth')) {
                this.authService.logoutWithoutRequest().then(() => {
                  this.routerNavigation.navigateBack(['/home/sign-in']);
                  this.toastService.createError(_('The session has expired'));
                });
              } else {
                return this.authService.refreshToken().pipe(
                  switchMap(() => {
                    return from(this.addAuthHeader(rawRequest)).pipe(
                      switchMap(refreshedBearerRequest => {
                        return next.handle(refreshedBearerRequest);
                      }),
                    );
                  }),
                );
              }
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
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    }

    return request;
  }
}
