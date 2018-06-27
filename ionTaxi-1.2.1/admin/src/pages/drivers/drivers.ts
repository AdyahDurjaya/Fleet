import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { DriverinfoPage } from '../driverinfo/driverinfo';


@IonicPage()
@Component({
  selector: 'page-drivers',
  templateUrl: 'drivers.html',
})
export class DriversPage {
  drivers: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriversPage');
    this.getDrivers();
  }

  getDrivers(){
    let loader = this.loadCtrl.create({ content:'Loading..'});
    loader.present();
    console.log("calling");
    firebase.database().ref('drivers').on('value', snapshot => {
      let tmp = [];
      snapshot.forEach(snap => {
        let data = { key: snap.key,... snap.val()};
        tmp.push(data);
        return false;
      })
      this.drivers = tmp;
      console.log(this.drivers);
      loader.dismiss()
    });
  }
  goDriverInfo(driver){
    this.navCtrl.push(DriverinfoPage,driver);
  }
  openInfo(key){
    console.log(key);
    this.modalCtrl.create(DriverinfoPage, { key}).present();
  }
  delete(key){
    firebase.database().ref('drivers/'+key).remove().then(data=>{
      this.displayToast("Deleted Successfully");
    })
  }
  displayToast(msg){
    this.toastCtrl.create({ message: msg, duration: 2000}).present();
  }
}
