import { Injectable } from '@angular/core';
import { Meeting } from './meeting';
import { Gender } from '../profile/profile';
import * as moment from 'moment';
import { StoreService } from '../../shared/store.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingStoreService extends StoreService<Meeting> {
  constructor() {
    super();
    this.fill();
  }

  fill() {
    this.set({
      id: 1,
      users: [
        {
          id: 1,
          profile: {
            photos: [
              'https://rafalschmidt.com/skelvy/avatar.jpg',
              'https://rafalschmidt.com/skelvy/avatar2.jpg',
              'https://rafalschmidt.com/skelvy/avatar3.jpg',
            ],
            name: 'Rafał',
            birthDate: moment('22.04.1997', 'DD.MM.YYYY').toDate(),
            description: `
            I am ambitious, open-minded and willing learn new things developer from Jastrzębie-Zdrój.
            Student of Opole University of Technology. Software Engineer at YourCompany
          `,
            gender: Gender.MALE,
          },
        },
        {
          id: 1,
          profile: {
            photos: [
              'https://rafalschmidt.com/skelvy/avatar2.jpg',
              'https://rafalschmidt.com/skelvy/avatar.jpg',
              'https://rafalschmidt.com/skelvy/avatar3.jpg',
            ],
            name: 'Damian',
            birthDate: moment('22.04.1996', 'DD.MM.YYYY').toDate(),
            description: `Student of Wrocław University of Science and Technology`,
            gender: Gender.MALE,
          },
        },
        {
          id: 3,
          profile: {
            photos: [
              'https://rafalschmidt.com/skelvy/avatar3.jpg',
              'https://rafalschmidt.com/skelvy/avatar2.jpg',
              'https://rafalschmidt.com/skelvy/avatar.jpg',
            ],
            name: 'Krzysztof',
            birthDate: moment('22.04.1995', 'DD.MM.YYYY').toDate(),
            description: null,
            gender: Gender.MALE,
          },
        },
      ],
      drink: {
        id: 1,
        name: 'Beer',
      },
      date: new Date(),
      address: {
        latitude: 1,
        longitude: 1,
        city: 'Jastrzębie-Zdrój',
        state: 'Silesian',
        country: 'Poland',
      },
    });
  }
}
