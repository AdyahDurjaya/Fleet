import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DriversPage } from '../pages/drivers/drivers';
import { DriverinfoPage } from '../pages/driverinfo/driverinfo';

import { TripsPage } from '../pages/trips/trips';
import { CarsPage } from '../pages/cars/cars';
import { PassengersPage } from '../pages/passengers/passengers';
import { PassengerinfoPage } from '../pages/passengerinfo/passengerinfo';
import { PromosPage } from '../pages/promos/promos';
import { LoginPage } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DriversPage,
    DriverinfoPage,
    PassengerinfoPage,
    TripsPage,
    CarsPage,
    PassengersPage,
    PromosPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DriversPage,
    DriverinfoPage,
    TripsPage,
    CarsPage,
    PassengersPage,
    PassengerinfoPage,
    PromosPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
