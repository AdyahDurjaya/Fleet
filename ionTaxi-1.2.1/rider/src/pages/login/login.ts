import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home'
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';
import { ENABLE_SIGNUP } from '../../services/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";
  isRegisterEnabled:any = true;
  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,public loadingCtrl: LoadingController, public toast: ToastController, public translate: TranslateService) {
    this.isRegisterEnabled = ENABLE_SIGNUP;
  }

  signup() {
    this.nav.setRoot(RegisterPage);
  }
  reset(){
    if(this.email){
      firebase.auth().sendPasswordResetEmail(this.email)
      .then( data =>
        this.toast.create({ message:'Please check your mail', duration: 3000}).present())
      .catch( err => this.toast.create({ message: err.message, duration: 3000}).present())
    }
  }

  login() {
    if(this.email.length == 0 || this.password.length == 0){
      this.alertCtrl.create({ subTitle:'Invalid Credentials', buttons: ['ok']}).present();
    }
    else{
      let loading = this.loadingCtrl.create({ content: 'Authenticating...'});
      loading.present();
  
      this.authService.login(this.email, this.password).then(authData => {
        loading.dismiss();
        this.nav.setRoot(HomePage);
      }, error => {
        // in case of login error
        loading.dismiss();
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }

  }
}