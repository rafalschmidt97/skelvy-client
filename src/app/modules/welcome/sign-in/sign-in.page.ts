import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  iframe: Iframe;
  @ViewChild('iframe') iframeTemplate: TemplateRef<any>;
  url: string;
  title: string;

  constructor(
    private readonly iframeService: IframeService,
    private readonly facebook: Facebook,
    private readonly storage: Storage,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.storage.get('facebook_token').then(token => {
      console.log(token);

      const profileUrl =
        'https://graph.facebook.com/me?fields=id,birthday,email,first_name,gender,picture.width(512).height(512){url}&access_token=';

      this.http.get(profileUrl + token).subscribe(profile => {
        console.log(profile);
      });
    });
  }

  show(url: string, title = '') {
    this.url = url;
    this.title = title;

    this.iframe = this.iframeService.show(this.iframeTemplate);
  }

  decline() {
    this.iframe.hide();
  }

  signInWithFacebook() {
    this.facebook
      .login(['public_profile', 'email', 'user_birthday', 'user_gender'])
      .then((res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          this.storage.set('facebook_token', res.authResponse.accessToken);
        } else {
          console.log('Error logging into Facebook', res.status);
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
}
