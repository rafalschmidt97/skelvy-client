import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { ProfileDto, UserDto, UserModel } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService extends StoreService<UserModel> {
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
