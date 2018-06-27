import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// angularfire2
import { AngularFireAuth } from "angularfire2/auth/auth";
// import service
import { AuthService } from "../services/auth-service";
import { PlaceService } from "../services/place-service";
import { DriverService } from "../services/driver-service";
import { TranslateService } from '@ngx-translate/core';

// import page
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TripService } from "../services/trip-service";
import { PickUpPage } from "../pages/pick-up/pick-up";

import { TRIP_STATUS_WAITING, TRIP_STATUS_GOING } from "../services/constants";


@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})

export class MyApp {
  rootPage: any;
  nav: any;
  positionTracking: any;
  driver: any;
  user: any = {};

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, placeService: PlaceService,
    driverService: DriverService, afAuth: AngularFireAuth,
    public authService: AuthService, tripService: TripService, public translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // check for login stage, then redirect
      afAuth.authState.take(1).subscribe(authData => {
        if (authData) {
          let root: any = HomePage;

          // check for uncompleted trip
          tripService.getTrips().take(1).subscribe(trips => {
            trips.forEach(trip => {
              if (trip.status == TRIP_STATUS_WAITING || trip.status == TRIP_STATUS_GOING) {
                tripService.setCurrentTrip(trip.$key);
                root = PickUpPage;
              }
            });

            // if all trip are completed, go to home page
            this.nav.setRoot(root);
          });
        } else {
          this.nav.setRoot(LoginPage);
        }
      });

      // get user data
      afAuth.authState.subscribe(authData => {
        console.log(authData);
        if (authData) {
          this.user = authService.getUserData();

          // get user info from service
          driverService.setUser(this.user);
          driverService.getDriver().subscribe(snapshot => {
            this.driver = snapshot;
          });
        } else {
          this.driver = null;
        }
      });
    });
  }


}

