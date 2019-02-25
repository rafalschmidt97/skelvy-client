import { Injectable } from '@angular/core';
import { MeetingModel } from './meeting';
import { StoreService } from '../../shared/store.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingStoreService extends StoreService<MeetingModel> {}
