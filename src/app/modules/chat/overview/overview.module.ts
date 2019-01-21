import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { EmptyComponent } from './empty/empty.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { MessageComponent } from './messages/message/message.component';
import { AutoScrollDirective } from './auto-scroll.directive';

const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    OverviewPage,
    EmptyComponent,
    MessagesComponent,
    MessageFormComponent,
    MessageComponent,
    AutoScrollDirective,
  ],
})
export class OverviewPageModule {}
