import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-promos',
  templateUrl: 'promos.html',
})
export class PromosPage {
  promocodes: any = [];
  newpromocode: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromosPage');
    this.getPromos();
  }
  getPromos(){
    firebase.database().ref('promocodes').on('value', snapshot=>{
      let tmp = [];
      snapshot.forEach( promo =>{
        tmp.push({ key: promo.key, ...promo.val()});
        return false;
      })
      this.promocodes = tmp;
    });
  }
  delete(key){
    firebase.database().ref('promocodes/'+key).remove();
  }
  add(){
    firebase.database().ref('promocodes').push(this.newpromocode).then( data=>{
      this.displayToast("New Promo code added");
    });
  }
  update(i){
    let promocode = this.promocodes[i];
    firebase.database().ref('promocodes/'+promocode.key).update(promocode).then(data=>{
      this.displayToast("Updated Successfully");
    }).catch( err=> console.log(err));
  }
  displayToast(message){
    this.toastCtrl.create({ message: message, duration: 2000}).present();
  }
}
