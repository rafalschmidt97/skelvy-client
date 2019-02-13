import { Injectable } from '@angular/core';
import { Meeting } from './meeting';
import { Gender } from '../profile/user';
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
              {
                url: 'https://rafalschmidt.com/skelvy/avatar2.jpg',
              },
              {
                url: 'https://rafalschmidt.com/skelvy/avatar.jpg',
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
        },
        {
          id: 2,
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
            name: 'Damian',
            birthday: moment('22.04.1996', 'DD.MM.YYYY').toDate(),
            description: `Student of Wrocław University of Science and Technology`,
            gender: Gender.MALE,
          },
        },
        {
          id: 3,
          profile: {
            photos: [
              {
                url: 'https://rafalschmidt.com/skelvy/avatar3.jpg',
              },
              {
                url: 'https://rafalschmidt.com/skelvy/avatar2.jpg',
              },
              {
                url: 'https://rafalschmidt.com/skelvy/avatar.jpg',
              },
            ],
            name: 'Krzysztof',
            birthday: moment('22.04.1995', 'DD.MM.YYYY').toDate(),
            description: null,
            gender: Gender.MALE,
          },
        },
        {
          id: 4,
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
            name: 'Patryk',
            birthday: moment('22.04.1994', 'DD.MM.YYYY').toDate(),
            description: 'I love Java language. This is my favourite language!',
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
