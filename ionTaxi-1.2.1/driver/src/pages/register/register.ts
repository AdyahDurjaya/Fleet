import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from "../home/home";
import { AuthService } from "../../services/auth-service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  userInfo: any = {};
  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public translate: TranslateService) { }

  signup() {
    let loading = this.loadingCtrl.create({ content: 'Creating Account...' });
    loading.present();
    this.authService.register(this.userInfo).subscribe(authData => {
      loading.dismiss();
      this.nav.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      this.alertCtrl.create({ message: error.message, buttons: ['OK'] }).present();
    });
  }

  login() {
    this.nav.setRoot(LoginPage);
  }
}
