import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<User> {
    return this.userService.getUser();
  }
}
