import { Component, TemplateRef, ViewChild } from '@angular/core';
import { User } from '../user';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';
import { Observable } from 'rxjs';
import { UserStoreService } from '../user-store.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @ViewChild('details') details: TemplateRef<any>;
  modal: Modal;
  user$: Observable<User>;

  constructor(
    private readonly userStore: UserStoreService,
    private readonly modalService: ModalService,
  ) {
    this.user$ = userStore.data;
  }

  open() {
    this.modal = this.modalService.show(this.details);
  }

  confirm() {
    this.modal.hide();
  }
}
