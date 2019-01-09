import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap';
import { get } from 'lodash';
import { Alert } from './alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly modalService: BsModalService) {}

  show(template: TemplateRef<any>, options?: ModalOptions): Alert {
    return this.modalService.show(template, {
      ignoreBackdropClick: get(options, 'ignoreBackdropClick', false),
      keyboard: get(options, 'keyboard', true),
      class: get(options, 'class', ''),
    });
  }

  confirmation(template: TemplateRef<any>, isSmall = true): Alert {
    return this.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      class: isSmall ? 'modal-dialog-sm' : '',
    });
  }
}
