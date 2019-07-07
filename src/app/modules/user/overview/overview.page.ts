import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UserDto } from '../user';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';
import { Observable } from 'rxjs';
import { UserState } from '../store/user-state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @ViewChild('details') details: TemplateRef<any>;
  modal: Modal;
  user$: Observable<UserDto>;

  constructor(
    private readonly userState: UserState,
    private readonly modalService: ModalService,
  ) {
    this.user$ = userState.data$;
  }

  open() {
    this.modal = this.modalService.show(this.details, true);
  }

  confirm() {
    this.modal.hide();
  }
}
