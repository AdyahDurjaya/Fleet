import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { DEFAULT_AVATAR, DRIVER_INIT_BALANCE, DRIVER_INIT_RATING, EMAIL_VERIFICATION_ENABLED, APPROVAL_REQUIRED } from "./constants";

@Injectable()
export class AuthService {
  user: any;
  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase,) {}

  getUserData() { // get current user data from firebase
    return this.afAuth.auth.currentUser;
  }

  getUser(id) { // get driver by id
    return this.db.object('drivers/' + id);
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password); // login with email & password
  }

  logout() {
    return this.afAuth.auth.signOut();   // logout from firebase
  }

  // register new account
  register(userInfo) {
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then((authData: any) => {
        // update driver object
        userInfo.uid = authData.uid;
        userInfo.rating = DRIVER_INIT_RATING;
        userInfo.balance = DRIVER_INIT_BALANCE;
        userInfo.photoURL = DEFAULT_AVATAR;
        userInfo.canRide = !APPROVAL_REQUIRED;
        userInfo.isPhoneVerified = false;
        
        this.getUserData().updateProfile({ displayName: userInfo.name, photoURL: DEFAULT_AVATAR });
        this.db.object('drivers/' + userInfo.uid).update(userInfo);
        
        if(EMAIL_VERIFICATION_ENABLED === true)
          this.getUserData().sendEmailVerification();
          observer.next();
      }).catch((error: any) => {
        if (error) {
          observer.error(error);
        }
      });
    });
  }
}
