import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection } from '../../../core/state/global-state';
import {
  animate,
  state as animationState,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  animations: [
    trigger('fadeInOut', [
      animationState(
        'true',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      animationState(
        'false',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        }),
      ),
      transition('0 => 1', animate('0.1s')),
      transition('1 => 0', animate('0.1s 1s')),
    ]),
  ],
})
export class ConnectionComponent {
  @Input() hasBackground: boolean;
  @Select(state => state.global.connection) connection$: Observable<Connection>;
  connectedStatus = Connection;
}
