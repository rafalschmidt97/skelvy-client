import { Injectable } from '@angular/core';
import { State } from '../../shared/state';
import { ProfileDto, UserDto, UserStateModel } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserState extends State<UserStateModel> {
  setUser(user: UserDto) {
    this.subject.next({
      ...this.subject.getValue(),
      id: user.id,
      profile: user.profile,
    });
  }

  setProfile(profile: ProfileDto) {
    this.subject.next({
      ...this.subject.getValue(),
      profile,
    });
  }
}
