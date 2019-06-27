import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasicFieldComponent } from '../../../../shared/form/basic-field.component';
import { MeetingSuggestionsModel } from '../../meeting';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
})
export class SuggestionsComponent extends BasicFieldComponent {
  @Input() suggestions: MeetingSuggestionsModel;
  @Output() join = new EventEmitter<number>();
  @Output() connect = new EventEmitter<number>();
  @Input() label: string;
}
