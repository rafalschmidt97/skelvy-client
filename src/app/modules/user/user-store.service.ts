import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { UserDto } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService extends StoreService<UserDto> {}
