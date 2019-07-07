import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { i18nConfiguration } from './core/i18n/translate';
import { CoreModule } from './core/core.module';
import { ModalModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Push } from '@ionic-native/push/ngx';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from '../environments/environment';
import { state } from './core/redux/redux';
import { registerReduxDevToolOnDevice } from './core/redux/remote-devtools-proxy';

if (!environment.production) {
  registerReduxDevToolOnDevice();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    IonicModule.forRoot(),
    TranslateModule.forRoot(i18nConfiguration),
    IonicStorageModule.forRoot(),
    NgxsModule.forRoot(state),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'skelvy',
      disabled: environment.production,
    }),
    ModalModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    Facebook,
    GooglePlus,
    Geolocation,
    Push,
    Device,
    InAppBrowser,
    AppRate,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
