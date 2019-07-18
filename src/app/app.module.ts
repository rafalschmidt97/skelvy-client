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
import { NGXS_PLUGINS, NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from '../environments/environment';
import { appState, clearState } from './core/redux/redux';
import { registerReduxDevToolOnDevice } from './core/redux/remote-devtools-proxy';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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
    NgxsModule.forRoot(appState, {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'skelvy',
      disabled: environment.production,
    }),
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
    Camera,
    Crop,
    WebView,
    File,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: NGXS_PLUGINS,
      useValue: clearState,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
