import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SelfUserDto, UserDto } from '../user';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  detailsModal: Modal;
  @Select(state => state.user.user) user$: Observable<SelfUserDto>;
  detailsUser: UserDto;

  constructor(
    private readonly modalService: ModalService,
    private readonly store: Store,
  ) {}

  openDetails() {
    const user: SelfUserDto = this.store.selectSnapshot(
      state => state.user.user,
    );
    this.detailsUser = {
      ...user,
      profile: {
        ...user.profile,
        age: moment().diff(moment(user.profile.birthday), 'years'),
      },
    };
    this.detailsModal = this.modalService.show(this.detailsTemplate, true);
  }

  confirmDetails() {
    this.detailsModal.hide();
  }
}
