import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import { DriverinfoPage } from '../driverinfo/driverinfo';
import { PassengerinfoPage } from '../passengerinfo/passengerinfo';

@IonicPage()
@Component({
  selector: 'page-trips',
  templateUrl: 'trips.html',
})
export class TripsPage {
  trips: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripsPage');
    this.getAllTrips();
  }

  getAllTrips(){
    firebase.database().ref('trips').on('value',snapshot => {
      let tmp = [];
      snapshot.forEach( snap =>{
        tmp.push({ key: snap.key, ...snap.val()});
        return false;
      })
      this.trips = tmp;
    })
  }

  showDriver(key){
    this.modalCtrl.create(DriverinfoPage, { key }).present();
  }
  showPassenger(key){
    this.modalCtrl.create(PassengerinfoPage,{ key }).present();
  }

}
