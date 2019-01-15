import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Gender, Profile } from '../profile';
import * as moment from 'moment';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  modal: Modal;
  @ViewChild('details') details: TemplateRef<any>;

  profile: Profile = {
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
  };

  constructor(private readonly modalService: ModalService) {}

  open() {
    this.modal = this.modalService.show(this.details);
  }

  confirm() {
    this.modal.hide();
  }
}
