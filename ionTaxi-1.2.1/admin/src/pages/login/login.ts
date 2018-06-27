import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: any = {};
  adminEmail:any = 'anshulgelani@gmail.com';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  login(){
    firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(data=>{
      console.log(data);
      if(firebase.auth().currentUser.email == this.adminEmail){
        this.viewCtrl.dismiss();
      }
    }).catch(err => console.log(err));
  }

}
