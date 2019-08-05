import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { EmptyComponent } from './empty/empty.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { MessageComponent } from './messages/message/message.component';
import { AutoScrollDirective } from './auto-scroll.directive';
import { MessageAnonymousComponent } from './messages/message-anonymous/message-anonymous.component';
import { MessageUserComponent } from './messages/message-user/message-user.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { MessageActionModalComponent } from './messages/message-action-modal/message-action-modal.component';
import { MessageActionsComponent } from './messages/message-actions/message-actions.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  entryComponents: [ImageViewerComponent, MessageActionModalComponent],
  declarations: [
    OverviewPage,
    EmptyComponent,
    ImageViewerComponent,
    MessageActionModalComponent,
    MessagesComponent,
    MessageFormComponent,
    MessageComponent,
    MessageUserComponent,
    MessageAnonymousComponent,
    AutoScrollDirective,
    MessageActionsComponent,
  ],
})
export class OverviewPageModule {}
