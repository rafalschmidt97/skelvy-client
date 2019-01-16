import { Component, OnInit } from '@angular/core';
import { Meeting, MeetingRequest } from '../meeting';
import { Gender } from '../../profile/profile';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage {
  meeting: Meeting;
  request: MeetingRequest;

  leaveMeeting() {
    this.meeting = null;
  }

  removeRequest() {
    this.request = null;
  }

  addMeeting() {
    this.fillMeeting();
  }

  addRequest() {
    this.meeting = null;
    this.fillRequest();
  }

  private fillMeeting() {
    this.meeting = {
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
    };
  }

  private fillRequest() {
    this.request = {
      id: 1,
      minimumDate: new Date(),
      maximumDate: new Date(),
      address: {
        latitude: 1,
        longitude: 1,
        city: 'Jastrzębie-Zdrój',
        state: 'Silesian',
        country: 'Poland',
      },
      drinks: [
        {
          id: 1,
          name: 'Beer',
        },
        {
          id: 2,
          name: 'Wine',
        },
        {
          id: 3,
          name: 'Whiskey',
        },
      ],
      minimumAge: 18,
      maximumAge: 25,
    };
  }
}
