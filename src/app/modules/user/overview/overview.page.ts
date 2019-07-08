import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UserDto } from '../user';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @ViewChild('details') details: TemplateRef<any>;
  modal: Modal;
  @Select(state => state.user.user) user$: Observable<UserDto>;

  constructor(private readonly modalService: ModalService) {}

  open() {
    this.modal = this.modalService.show(this.details, true);
  }

  confirm() {
    this.modal.hide();
  }
}
