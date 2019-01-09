import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IframeComponent {
  @Input() url: string;
  @Input() title: string;
  @Output() decline = new EventEmitter();
}
