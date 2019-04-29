import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { HttpInterceptorsModule } from './http/http-interceptors.module';

@NgModule({
  imports: [HttpInterceptorsModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
