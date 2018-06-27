import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlacesPage } from '../places/places';
import { PaymentMethodPage } from '../payment-method/payment-method';
import { UserPage } from "../user/user";
import { TrackingPage } from '../tracking/tracking';

import { PlaceService } from "../../services/place-service";
import { DealService } from "../../services/deal-service";
import { SettingService } from "../../services/setting-service";
import { DriverService } from "../../services/driver-service";
import { TripService } from "../../services/trip-service";
import { SHOW_VEHICLES_WITHIN, POSITION_INTERVAL, VEHICLE_LAST_ACTIVE_LIMIT } from "../../services/constants";
import { DEAL_STATUS_PENDING, DEAL_STATUS_ACCEPTED } from "../../services/constants";
import 'rxjs/Rx'
import { AngularFireAuth } from "angularfire2/auth/auth";
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';

import { TranslateService } from '@ngx-translate/core';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  mapId = Math.random() + 'map';
  mapHeight: number = 480;
  showModalBg: boolean = false;
  showVehicles: boolean = false;
  vehicles: any = [];
  currentVehicle: any;
  note: any = '';
  promocode: any = '';
  map: any;
  origin: any;
  destination: any;
  loading: any;
  distance: number = 0;
  duration: number = 0;
  currency: string;
  locality: any;
  paymentMethod: string = 'cash';
  activeDrivers: Array<any> = [];
  driverMarkers: Array<any> = [];
  driverTracking: any;
  locateDriver: any = false;
  drivers: any;
  user = {};
  isTrackDriverEnabled = true;
  discount:any = 0;
  startLatLng: any;
  destLatLng: any;
  directionsService: any;
  directionsDisplay: any;
  bounds:any;
  cardNumber: any;

  distanceText:any = '';
  durationText:any = '';

  constructor(public nav: NavController, public platform: Platform, public alertCtrl: AlertController,
    public placeService: PlaceService, private geolocation: Geolocation, private chRef: ChangeDetectorRef,
    public loadingCtrl: LoadingController, public settingService: SettingService,
    public tripService: TripService, public driverService: DriverService, public afAuth: AngularFireAuth,
    public authService: AuthService, public translate: TranslateService,
    public dealService: DealService) {
      // this.translate.setDefaultLang('en');
    this.origin = tripService.getOrigin();
    this.destination = tripService.getDestination();

    afAuth.authState.subscribe(authData => {
      if (authData) {
        this.user = authService.getUserData();
      }
    });
    
  }

  ionViewDidLoad() {
    // on view ready, start loading map
    this.tripService.getTrips().subscribe( trips => {
      console.log(trips);
      trips.forEach(trip => {
        console.log(trip.status);
        if(trip.status == 'waiting' || trip.status =='accepted' || trip.status == 'going'){
          this.isTrackDriverEnabled = false;
          this.nav.setRoot(TrackingPage, { tripId: trip.$key });
        }
      })
    })
    //this.calcRoute();
    this.loadMap();
  }

  ionViewWillLeave() {
    // stop tracking driver
    clearInterval(this.driverTracking);
  }

  // get current payment method from service
  getPaymentMethod() {
    this.paymentMethod = this.tripService.getPaymentMethod()
    return this.paymentMethod;
  }
  choosePaymentMethod1(){
    let alert = this.alertCtrl.create({ message:'Profile -> Payments to add card'});
    alert.addInput({ type: 'radio', label: 'Cash', value: 'cash', checked: true });
    this.authService.getCardSetting().take(1).subscribe(snapshot => {
      if (snapshot) {
        this.cardNumber = snapshot.number;
        if (this.cardNumber != null || this.cardNumber != undefined)
          alert.addInput({ type: 'radio', label: 'Credit Card', value: 'card' });
      }
    });

    alert.addButton({ text: 'Cancel'});

    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log(data);
        this.tripService.setPaymentMethod(data);
      }
    });
    alert.present();
  }

  // toggle active vehicle
  chooseVehicle(index) {
    for (var i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].active = (i == index);
      // choose this vehicle type
      if (i == index) {
        this.tripService.setVehicle(this.vehicles[i]);
        this.currentVehicle = this.vehicles[i];
      }
    }
    // start tracking new driver type
    this.trackDrivers();
    this.toggleVehicles();
  }
  goProfilePage(){
    this.nav.push(UserPage,{ user: this.user });
  }

  // load map
  loadMap() {
    this.showLoading();

    // get current location
    return this.geolocation.getCurrentPosition().then((resp) => {

      if (this.origin) this.startLatLng = new google.maps.LatLng(this.origin.location.lat, this.origin.location.lng);
      else this.startLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      let directionsDisplay;
      let directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();

      this.map = new google.maps.Map(document.getElementById(this.mapId), {
        zoom: 15,
        center: this.startLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
      });
      
      let mapx = this.map;
      directionsDisplay.setMap(mapx);

      // find map center address
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': this.map.getCenter()}, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (!this.origin) {
            // set map center as origin
            this.origin = this.placeService.formatAddress(results[0]);
            this.tripService.setOrigin(this.origin.vicinity, this.origin.location.lat, this.origin.location.lng);
            this.setOrigin();
            this.chRef.detectChanges();
          } else {
            this.setOrigin();
          }

          // save locality
          let locality = this.placeService.setLocalityFromGeocoder(results);
          console.log('locality', locality);
          // load list vehicles
          this.settingService.getPrices().subscribe(snapshot => {
            console.log(snapshot);
            let obj = snapshot[locality] ? snapshot[locality] : snapshot.default;
            console.log(obj)
            this.currency = obj.currency;
            this.tripService.setCurrency(this.currency);

            // calculate price
            Object.keys(obj.vehicles).forEach(id => {
              obj.vehicles[id].id = id;
              this.vehicles.push(obj.vehicles[id]);
            });

            // calculate distance between origin adn destination
            if (this.destination) {
              this.placeService.getDirection(this.origin.location.lat, this.origin.location.lng, this.destination.location.lat,
                  this.destination.location.lng).subscribe(result => {
                    console.log(result);
                    if(result.routes.length != 0 ){
                      this.distance = result.routes[0].legs[0].distance.value;
                      
                      this.distanceText = result.routes[0].legs[0].distance.text;
                      this.durationText = result.routes[0].legs[0].duration.text;

                      for (let i = 0; i < this.vehicles.length; i++) {
                        this.vehicles[i].fee = this.distance * this.vehicles[i].price / 1000;
                        this.vehicles[i].fee = this.vehicles[i].fee.toFixed(2);
                      }
                    }else{
                      this.alertCtrl.create({
                        subTitle:'No Driver Found',
                        buttons: ['OK']
                      }).present();
                    }
              });
            }

            // set first device as default
            this.vehicles[0].active = true;
            this.currentVehicle = this.vehicles[0];

            this.locality = locality;
            if(this.isTrackDriverEnabled)
              this.trackDrivers();
          });
        }
      });

      // add destination to map
      if (this.destination) {
        this.destLatLng = new google.maps.LatLng(this.destination.location.lat, this.destination.location.lng);
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(this.startLatLng);
        bounds.extend(this.destLatLng);
        mapx.fitBounds(bounds);
        var request = {
            origin: this.startLatLng,
            destination: this.destLatLng,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(mapx);
            } else {
                console.log("error");
            }
        });
      }
      this.hideLoading();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  showPromoPopup(){
    let prompt = this.alertCtrl.create({
      title: 'Enter Promo code',
      message: "",
      inputs: [
        {
          name: 'promocode',
          placeholder: 'Enter Promo Code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Apply',
          handler: data => {
            console.log(data.promocode);
            //verifying promocode
            firebase.database().ref('promocodes').orderByChild("code").equalTo(data.promocode).once('value', promocodes => {
              console.log(promocodes.val());
              let tmp:any = [];
              promocodes.forEach( promo => {
                tmp.push({ key: promo.key, ...promo.val()})
                return false;
              })
              tmp = tmp[0];
              console.log(tmp)
              if(promocodes.val() != null || promocodes.val() != undefined){
                this.promocode = tmp.code;
                this.discount = tmp.discount;
                this.tripService.setPromo(tmp.code);
                this.tripService.setDiscount(tmp.discount);
                console.log('promo applied',tmp.code, tmp.discount);
              }
            }, err=> console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }


  // Show note popup when click to 'Notes to user'
  showNotePopup() {
    let prompt = this.alertCtrl.create({
      title: 'Notes to user',
      message: "",
      inputs: [
        {
          name: 'note',
          placeholder: 'Note'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.note = data;
            this.tripService.setNote(data);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  };

  // go to next view when the 'Book' button is clicked
  book() {
    this.locateDriver = true;
    // store detail
    this.tripService.setAvailableDrivers(this.activeDrivers);
    this.tripService.setDistance(this.distance);
    this.tripService.setFee(this.currentVehicle.fee);
    this.tripService.setIcon(this.currentVehicle.icon);
    this.tripService.setNote(this.note);
    this.tripService.setPromo(this.promocode);
    this.tripService.setDiscount(this.discount);
    // this.tripService.setPaymentMethod('');
    this.drivers = this.tripService.getAvailableDrivers();
    // sort by driver distance and rating
    this.drivers = this.dealService.sortDriversList(this.drivers);

    if (this.drivers) {
      this.makeDeal(0);
    }
    
  }

  makeDeal(index) {
    let driver = this.drivers[index];
    let dealAccepted = false;

    if (driver) {
      driver.status = 'Bidding';
      this.dealService.getDriverDeal(driver.$key).take(1).subscribe(snapshot => {
        // if user is available
        if (snapshot.$value === null) {
          // create a record
          console.log(snapshot);
          this.dealService.makeDeal(
              driver.$key,
              this.tripService.getOrigin(),
              this.tripService.getDestination(),
              this.tripService.getDistance(),
              this.tripService.getFee(),
              this.tripService.getCurrency(),
              this.tripService.getNote(),
              this.tripService.getPaymentMethod(),
              this.tripService.getPromo(),
              this.tripService.getDiscount()
          ).then(() => {
            let sub = this.dealService.getDriverDeal(driver.$key).subscribe(snap => {
              // if record doesn't exist or is accepted
              if (snap.$value === null || snap.status != DEAL_STATUS_PENDING) {
                sub.unsubscribe();

                // if deal has been cancelled
                if (snap.$value === null) {
                  this.nextDriver(index);
                } else if (snap.status == DEAL_STATUS_ACCEPTED) {
                  // if deal is accepted
                  console.log('accepted', snap.tripId);
                  dealAccepted = true;
                  this.drivers = [];
                  this.tripService.setId(snap.tripId);
                  // go to user page
                  this.nav.setRoot(TrackingPage);
                }
              }
            });
          });
        } else {
          this.nextDriver(index);
        }
      });
    } else {
      // show error & try again button
      console.log('No user found');
      this.locateDriver = false;
      this.alertCtrl.create({
        subTitle:'No Driver Found',
        buttons: ['OK']
      }).present();
    }
  }

  // make deal to next driver
  nextDriver(index) {
    this.drivers.splice(index, 1);
    this.makeDeal(index);
  }

  // choose origin place
  chooseOrigin() {
    // go to places page
    this.nav.push(PlacesPage, {type: 'origin'});
  }

  // choose destination place
  chooseDestination() {
    // go to places page
    this.nav.push(PlacesPage, {type: 'destination'});
  }

  // choose payment method
  choosePaymentMethod() {
    // go to payment method page
    this.nav.push(PaymentMethodPage);
  }

  // add origin marker to map
  setOrigin() {
    // add origin and destination marker
    let latLng = new google.maps.LatLng(this.origin.location.lat, this.origin.location.lng);
    let startMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    startMarker.setMap(this.map);
    if(this.destination)
      startMarker.setMap(null);
    // set map center to origin address
    this.map.setCenter(latLng);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  // show or hide vehicles
  toggleVehicles() {
    this.showVehicles = !this.showVehicles;
    this.showModalBg = (this.showVehicles == true);
  }

  // track drivers
  trackDrivers() {
    this.showDriverOnMap(this.locality);
    clearInterval(this.driverTracking);

    this.driverTracking = setInterval(() => {
      this.showDriverOnMap(this.locality);
    }, POSITION_INTERVAL);

    console.log(POSITION_INTERVAL);
  }

  // show drivers on map
  showDriverOnMap(locality) {
    // get active drivers
    this.driverService.getActiveDriver(locality, this.currentVehicle.id).take(1).subscribe(snapshot => {
      console.log('fresh vehicles');
      console.log(snapshot);
      // clear vehicles
      this.clearDrivers();

      // only show near vehicle
      snapshot.forEach(vehicle => {
        console.log(vehicle);
        // only show vehicle which has last active < 30 secs & distance < 5km
        let distance = this.placeService.calcCrow(vehicle.lat, vehicle.lng, this.origin.location.lat, this.origin.location.lng);
        console.log(distance);
        console.log("distance:"+distance+" Last Active: "+(Date.now() - vehicle.last_active));
        // checking last active time and distance
        if (distance < SHOW_VEHICLES_WITHIN && Date.now() - vehicle.last_active < VEHICLE_LAST_ACTIVE_LIMIT) {
          // create or update
          let latLng = new google.maps.LatLng(vehicle.lat, vehicle.lng);
          let angle = this.driverService.getIconWithAngle(vehicle);

          let marker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: {
              url: 'assets/img/icon/' + this.currentVehicle.icon + angle + '.png',
              size: new google.maps.Size(32, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(16, 16),
              scaledSize: new google.maps.Size(32, 32)
            },
          });

          // add vehicle and marker to the list
          vehicle.distance = distance;
          console.log(marker);
          this.driverMarkers.push(marker);
          this.activeDrivers.push(vehicle);
        } else {
          console.log('This vehicle is too far');
        }
        
      });
    });
  }

  // clear expired drivers on the map
  clearDrivers() {
    this.activeDrivers = [];
    this.driverMarkers.forEach((vehicle) => {
      vehicle.setMap(null);
    });
  }
}
