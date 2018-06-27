import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import { PassengerinfoPage } from '../passengerinfo/passengerinfo';

@IonicPage()
@Component({
  selector: 'page-passengers',
  templateUrl: 'passengers.html',
})
export class PassengersPage {
  passengers: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomersPage');
    this.getPassengers();
  }
  getPassengers(){
    let loader = this.loadCtrl.create({ content:'Loading..'});
    loader.present();
    console.log("calling");
    firebase.database().ref('passengers').on('value', snapshot => {
      let tmp = [];
      snapshot.forEach(snap => {
        let data = { key: snap.key,... snap.val()};
        tmp.push(data);
        return false;
      })
      this.passengers = tmp;
      loader.dismiss()
    });
  }
  showPassengerInfo(key){
    this.modalCtrl.create(PassengerinfoPage, {key}).present();
  }

}
