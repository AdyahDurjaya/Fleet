import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Import moment module
import { MomentModule } from 'angular2-moment';

// import services
import { DriverService } from '../services/driver-service';

import { PlaceService } from '../services/place-service';
import { TripService } from '../services/trip-service';
import { SettingService } from "../services/setting-service";
import { DealService } from "../services/deal-service";
import { AuthService } from "../services/auth-service";


import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PaymentMethodPage } from '../pages/payment-method/payment-method';
import { PlacesPage } from '../pages/places/places';
import { RegisterPage } from '../pages/register/register';
import { TrackingPage } from '../pages/tracking/tracking';
import { MapPage } from "../pages/map/map";
import { UserPage } from '../pages/user/user';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

export const firebaseConfig = {
  apiKey: "AIzaSyASfN_OVXgjuLbKKv6TKul-1S14joHFzww",
  authDomain: "ionfiretaxi.firebaseapp.com",
  databaseURL: "https://ionfiretaxi.firebaseio.com",
  projectId: "ionfiretaxi",
  storageBucket: "ionfiretaxi.appspot.com",
  messagingSenderId: "493104185856"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PaymentMethodPage,
    PlacesPage,
    RegisterPage,
    TrackingPage,
    MapPage,
    UserPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MomentModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PaymentMethodPage,
    PlacesPage,
    RegisterPage,
    TrackingPage,
    MapPage,
    UserPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    DriverService,
    PlaceService,
    TripService,
    SettingService,
    DealService,
    AuthService,
    { provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
