import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-driverinfo',
  templateUrl: 'driverinfo.html',
})
export class DriverinfoPage {
  driver:any = {};
  tabs: any = 'carinfo';
  trips: any = [];
  driverKey:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public viewCtrl: ViewController, public toastCtrl: ToastController) {
    this.driverKey = navParams.get('key');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverinfoPage');
    this.getDriverInfo();
  }
  getDriverInfo(){
    firebase.database().ref('drivers/'+this.driverKey).on('value', snapshot => {
      this.driver = snapshot.val();
      console.log(this.driver);
    });
  }

  getTrips(){
    let loading = this.loadCtrl.create({ content: 'Please wait...'});
    loading.present();
    firebase.database().ref('trips').orderByChild('driverId').equalTo(this.driverKey).on('value', snapshot =>{
      console.log(snapshot);
      let tmp = [];
      snapshot.forEach(snap=>{
        tmp.push({ key: snap.key, ...snap.val()});
        return false;
      })
      this.trips = tmp;
      loading.dismiss();
    });
  }

  updateDriver(){
    firebase.database().ref('drivers/'+this.driverKey).update(this.driver).then(data=>{
      this.displayToast("Updated Successfully");
    });
  }

  displayToast(message){
    this.toastCtrl.create({ message: message, duration: 2000}).present()
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
