import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStoreService } from '../../../modules/user/user-store.service';
import { Connection } from '../../../modules/user/user';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent {
  connection$: Observable<Connection>;
  connectedStatus = Connection;

  constructor(userStore: UserStoreService) {
    this.connection$ = userStore.data$.pipe(map(x => x.connection));
  }
}
