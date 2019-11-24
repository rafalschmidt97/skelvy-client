import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  messagesToRead = 0;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store
      .select(state => state.meetings)
      .subscribe(async meetings => {
        if (!meetings.loading) {
          this.messagesToRead = meetings.toRead;
        }
      });
  }
}
