import { Injectable } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { Gender, User } from './user';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService extends StoreService<User> {
  constructor() {
    super();
    this.fill();
  }

  fill() {
    this.set({
      id: 1,
      profile: {
        photos: [
          {
            url: 'https://rafalschmidt.com/skelvy/avatar.jpg',
          },
          {
            url: 'https://rafalschmidt.com/skelvy/avatar2.jpg',
          },
          {
            url: 'https://rafalschmidt.com/skelvy/avatar3.jpg',
          },
        ],
        name: 'Rafał',
        birthday: moment('22.04.1997', 'DD.MM.YYYY').toDate(),
        description: `
          I am ambitious, open-minded and willing learn new things developer from Jastrzębie-Zdrój.
          Student of Opole University of Technology. Software Engineer at YourCompany
        `,
        gender: Gender.MALE,
      },
    });
  }
}
