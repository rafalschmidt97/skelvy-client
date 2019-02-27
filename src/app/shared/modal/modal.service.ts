import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap';
import { get } from 'lodash';
import { Modal } from './modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private readonly modalService: BsModalService) {}

  show(
    template: TemplateRef<any>,
    isFull = false,
    options?: ModalOptions,
  ): Modal {
    return this.modalService.show(template, {
      ignoreBackdropClick: get(options, 'ignoreBackdropClick', false),
      keyboard: get(options, 'keyboard', true),
      class: isFull
        ? get(options, 'class', 'modal-dialog-full')
        : get(options, 'class', ''),
    });
  }
}
