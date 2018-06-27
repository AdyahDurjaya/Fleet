import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cars',
  templateUrl: 'cars.html',
})
export class CarsPage {
  cars:any = [];
  newCar = { icon: ''};
  carTemp: any = [];
  currency: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.getCarInfo();
  }
  getCarInfo(){
    firebase.database().ref('master_settings/prices/default/').child('currency').on('value', currency => { this.currency = currency.val() });
    firebase.database().ref('master_settings/prices/default/vehicles/').on('value', snapshot=>{
      let tmp = [];
      snapshot.forEach( car =>{
        tmp.push({ key: car.key, ...car.val()});
        return false;
      })
      this.cars = tmp;
    });
  }
  delete(key){
    firebase.database().ref('master_settings/prices/default/vehicles/'+key).remove();
  }
  add(){
    firebase.database().ref('master_settings/prices/default/vehicles/'+ this.newCar.icon).set(this.newCar).then( data=>{
      this.displayToast("New Car has beed added");
      this.newCar = { icon:''};
    });
  }
  update(i){
    let car = this.cars[i];
    firebase.database().ref('master_settings/prices/default/vehicles/'+car.key).update(car).then(data=>{
      this.displayToast("Updated Successfully");
    }).catch( err=> console.log(err));
  }
  updateCurrency(){
    firebase.database().ref('master_settings/prices/default/').child('currency').set(this.currency);
  }
  displayToast(message){
    this.toastCtrl.create({ message: message, duration: 2000}).present();
  }

  setDefault(){
    firebase.database().ref('master_settings').set({
        "prices" : {
          "default" : {
            "currency" : "$",
            "vehicles" : {
              "car" : {
                "enable" : true,
                "icon" : "sedan",
                "name" : "Car",
                "price" : 0.2
              },
              "suv" : {
                "enable" : true,
                "icon" : "suv",
                "name" : "SUV",
                "price" : 0.2
              },
              "taxi" : {
                "enable" : true,
                "icon" : "taxi",
                "name" : "Taxi",
                "price" : 0.4
              }
            }
          }
        }
      }
    )
  }
}
