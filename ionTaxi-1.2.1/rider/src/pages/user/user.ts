import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { HomePage } from "../home/home";

import { AuthService } from "../../services/auth-service";
import { TripService } from '../../services/trip-service';
import { TranslateService } from '@ngx-translate/core';

import * as firebase from 'firebase';
import 'rxjs/add/operator/map';


declare var Stripe: any;
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  user:any = { photoURL: 'http://placehold.it/50x50' }; //setting default image, if user dont have images
  tripCount = 0;
  totalSpent = 0;
  tabs: any = 'profile';
  trips: Array<any>;
  number: any;
  exp: any;
  cvv: any;

  constructor(public nav: NavController, public authService: AuthService, public navParams: NavParams,public alertCtrl: AlertController,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController, public platform: Platform, public tripService: TripService, public translate: TranslateService) {
    let userx = navParams.get('user');
    this.authService.getUser(userx.uid).take(1).subscribe(snapshot => {
      snapshot.uid = snapshot.$key;
      this.user = snapshot;
      this.user.isEmailVerified = firebase.auth().currentUser.emailVerified;
      console.log(this.user);
    });
    authService.getCardSetting().take(1).subscribe(snapshot => {
      this.number = snapshot.number;
      this.exp = snapshot.exp;
      this.cvv = snapshot.cvv;
    });
  }

  // save user info
  save() {
    this.authService.updateUserProfile(this.user);
    this.nav.pop();
    this.displayToast("Profile has been updated");
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('avatar').click();
  }

  // upload thumb for item
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({ content: 'Please wait...'});
    loading.present();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.photoURL = snapshot.downloadURL;
      });
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
  getTrips(){
    let loading = this.loadingCtrl.create({ content: 'Please wait...'});
    loading.present();
    this.tripService.getTrips().take(1).subscribe(snapshot => {
      this.trips = snapshot.reverse();
      loading.dismiss();
    });
  }
  verifyPhone(){
    if(this.platform.is('core')){
      this.displayToast("Only Works on Device");
    }
    else{
      console.log(this.user.phoneNumber);
      (<any>window).AccountKitPlugin.loginWithPhoneNumber({
        useAccessToken: true,
        defaultCountryCode: "IN",
        facebookNotificationsEnabled: true,
        initialPhoneNumber: ["+91",this.user.phoneNumber]
      }, data => {
        this.displayToast("Verified Successfully");
        this.user.isPhoneVerified = true;
        this.authService.updateUserProfile(this.user);
      });
    }
  }

  verifyEmail(){
    firebase.auth().currentUser.sendEmailVerification().then( data => {
      this.displayToast("Please check your inbox");
    }).catch( err=> console.log(err));
  }

  displayToast(message){
    this.toastCtrl.create({ duration: 2000, message}).present();
  }


  // save card settings
  saveCard() {
    const exp = this.exp.split('/');
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    Stripe.card.createToken({
      number: this.number,
      exp_month: exp[0],
      exp_year: exp[1],
      cvc: this.cvv
    }, (status: number, response: any) => {
      loading.dismiss();
      // success
      if (status == 200) {
        // if nav from payment method selection
        if (this.navParams.get('back')) {
          this.nav.pop();
        } else {
          this.nav.setRoot(HomePage);
        }

        this.authService.updateCardSetting(this.number, this.exp, this.cvv, response.id);
        let toast = this.toastCtrl.create({
          message: 'Your card setting has been updated',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      } else {
        // error
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: response.error.message,
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }
}