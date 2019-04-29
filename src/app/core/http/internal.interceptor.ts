import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class InternalInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 500) {
          console.error('Internal Server Error', request, error); // TODO: send errors to the api
        }

        return throwError(error);
      }),
    );
  }
}
