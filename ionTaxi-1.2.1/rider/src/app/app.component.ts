import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import pages
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { AngularFireAuth } from "angularfire2/auth/auth";
import { AuthService } from "../services/auth-service";
import { UserPage } from "../pages/user/user";

import { TranslateService } from '@ngx-translate/core';

// end import pages

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})

export class MyApp {
  rootPage: any;
  nav: any;
  user = {};

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afAuth: AngularFireAuth,
    public authService: AuthService, public translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // check for login stage, then redirect
      afAuth.authState.take(1).subscribe(authData => {
        if (authData) {
          this.nav.setRoot(HomePage);
        } else {
          this.nav.setRoot(LoginPage);
        }
      });

      // get user data
      afAuth.authState.subscribe(authData => {
        if (authData) {
          this.user = authService.getUserData();
        }
      });
    });
  }

  // view current user profile
  viewProfile() {
    this.nav.push(UserPage, {
      user: this.user
    });
  }
}
