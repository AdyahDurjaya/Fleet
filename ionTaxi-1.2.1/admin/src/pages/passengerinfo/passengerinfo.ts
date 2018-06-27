import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-passengerinfo',
  templateUrl: 'passengerinfo.html',
})
export class PassengerinfoPage {
  passenger: any = {};
  passengerKey: any;
  trips: any = [];
  tabs:any = 'basicinfo';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadCtrl: LoadingController, public toastCtrl: ToastController) {
    this.passengerKey = navParams.get('key');
  }

  ionViewDidLoad() {
    this.getPassengersInfo();
  }
  getPassengersInfo(){
    firebase.database().ref('passengers/'+this.passengerKey).on('value', snapshot => {
      this.passenger = snapshot.val();
    })
  }
  getTrips(){
    let loading = this.loadCtrl.create({ content: 'Please wait...'});
    loading.present();
    firebase.database().ref('trips').orderByChild('passengerId').equalTo(this.passengerKey).on('value', snapshot =>{
      let tmp = [];
      snapshot.forEach(snap=>{
        tmp.push({ key: snap.key, ...snap.val()});
        return false;
      })
      this.trips = tmp;
      loading.dismiss();
    });
  }

  updateUserInfo(){
    firebase.database().ref('passengers/'+this.passengerKey).update(this.passenger).then(data=>{
      this.displayToast("Updated Successfully");
    }).catch( err => console.log(err));
  }

  displayToast(message){
    this.toastCtrl.create({ message: message, duration: 2000}).present()
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
