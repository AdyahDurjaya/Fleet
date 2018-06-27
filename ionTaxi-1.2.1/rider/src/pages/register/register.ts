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
  email: string = "";
  password: string = "";
  name: string = "";
  phoneNumber: string = ""
  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,public loadingCtrl: LoadingController, public translate: TranslateService) {}

  signup() {
    if(this.email.length == 0 || this.password.length == 0 || this.name.length == 0 || this.phoneNumber.length == 0){
      this.alertCtrl.create({ subTitle:'Invalid Credentials', buttons: ['ok']}).present();
    }
    else{
      let loading = this.loadingCtrl.create({ content: 'Creating Account...'});
      loading.present();
      this.authService.register(this.email, this.password, this.name, this.phoneNumber).subscribe(authData => {
        loading.dismiss();
        this.nav.setRoot(HomePage);
      }, error => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }

  }

  login() {
    this.nav.setRoot(LoginPage);
  }
}
