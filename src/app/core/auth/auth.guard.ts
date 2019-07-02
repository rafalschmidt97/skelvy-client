import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.sessionService.isAuthenticated().then(authenticated => {
      if (!authenticated) {
        this.routerNavigation.navigateRoot(['/home']);
      }

      return authenticated;
    });
  }
}
