import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TabsComponent],
  imports: [TabsRoutingModule, SharedModule],
})
export class TabsModule {}
