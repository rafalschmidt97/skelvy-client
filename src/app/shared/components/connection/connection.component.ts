import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Connection } from '../../../core/state';
import { StateStoreService } from '../../../core/state-store.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent {
  connection$: Observable<Connection>;
  connectedStatus = Connection;

  constructor(stateStore: StateStoreService) {
    this.connection$ = stateStore.data$.pipe(
      map(x => (x && x.connection ? x.connection : null)),
    );
  }
}
