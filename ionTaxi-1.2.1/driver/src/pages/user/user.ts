import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, Platform } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';
import { SettingService } from "../../services/setting-service";
import { LoginPage } from '../login/login';
import { CUSTOMER_CARE, CURRENCY_SYMBOL, DEFAULT_COUNTRY_CODE, DEFAULT_COUNTRY_MOBILE_CODE } from "../../services/constants";
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  user: any = {};
  currency: any;
  support = CUSTOMER_CARE;
  tripCount = 0;
  totalEarning = 0;
  rating: any = 5;
  types: Array<any> = [];
  tabs: any = 'profile';

  constructor(public nav: NavController, public authService: AuthService, public navParams: NavParams, public loadingCtrl: LoadingController,
    public settingService: SettingService, public alertCtrl: AlertController, public toastCtrl: ToastController, public platform: Platform, public translate: TranslateService) {
    let user = navParams.get('user');
    this.currency = CURRENCY_SYMBOL;
    // list of vehicle types
    this.settingService.getVehicleType().take(1).subscribe(snapshot => {
      console.log(snapshot);
      if (snapshot.$value === null) {
        this.settingService.getDefaultVehicleType().take(1).subscribe(snapshot => {
          this.types = Object.keys(snapshot);
          console.log(this.types);
        })
      } else {
        this.types = Object.keys(snapshot);
      }
    });

    this.authService.getUser(user.uid).take(1).subscribe(snapshot => {
      snapshot.uid = snapshot.$key;
      this.user = snapshot;
      this.rating = this.user.rating;
      this.getTrips();
    });
    this.user.isEmailVerified = firebase.auth().currentUser.emailVerified;
    console.log(this.user);
  }

  save() {
    this.authService.getUser(this.user.uid).update(this.user).then(data => {
      this.displayToast("Updated successfully")
      this.nav.setRoot(HomePage);
    });
  }
  chooseFile() { document.getElementById('avatar').click(); }

  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.photoURL = snapshot.downloadURL;
        this.save()
      });
    }
  }

  // code for uploading licence image
  chooseDocs() {
    document.getElementById('docsPDF').click();
  }
  uploadDocs() {
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('docsPDF')).files[0]]) {
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.docsURL = snapshot.downloadURL;
      });
    }
  }

  // show alert with message
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  getTrips() {
    console.log(this.user.uid);
    let ref = firebase.database().ref('trips');
    ref.orderByChild("driverId").equalTo(this.user.uid).on('value', snapshot => {
      console.log(snapshot.val());
      let tmp = [];
      let earning = 0;
      snapshot.forEach(snap => {
        if (snap.val().status === 'finished') {
          earning += parseFloat(snap.val().fee);
          let trip = { key: snap.key, ...snap };
          tmp.push(trip);
        }
        return false;
      })
      this.tripCount = tmp.length;
      this.totalEarning = earning;
    });
  }


  logout() {
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }

  verifyPhone() {
    if (this.platform.is('core')) {
      this.displayToast("Only Works on Device");
    }
    else {
      console.log(this.user.phoneNumber);
      (<any>window).AccountKitPlugin.loginWithPhoneNumber({
        useAccessToken: true,
        defaultCountryCode: DEFAULT_COUNTRY_CODE,
        facebookNotificationsEnabled: true,
        initialPhoneNumber: [DEFAULT_COUNTRY_MOBILE_CODE, this.user.phoneNumber]
      }, data => {
        this.displayToast("Verified Successfully");
        this.user.isPhoneVerified = true;
        //this.authService.updateUserProfile(this.user);
      });
    }
  }

  verifyEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(data => {
      this.displayToast("Please check your inbox");
    }).catch(err => console.log(err));
  }

  displayToast(message) {
    this.toastCtrl.create({ duration: 2000, message }).present();
  }
}