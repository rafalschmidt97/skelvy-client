import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Connection, GlobalState } from '../../../core/state/global-state';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'true',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      state(
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
  connection$: Observable<Connection>;
  connectedStatus = Connection;

  constructor(globalState: GlobalState) {
    this.connection$ = globalState.data$.pipe(
      map(x => (x && x.connection ? x.connection : null)),
    );
  }
}
