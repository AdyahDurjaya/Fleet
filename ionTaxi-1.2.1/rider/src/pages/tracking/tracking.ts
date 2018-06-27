import { Component } from '@angular/core';
import { NavController, Platform, ModalController, AlertController, NavParams} from 'ionic-angular';
import { DriverService } from '../../services/driver-service';
import { HomePage } from "../home/home";
import { TripService } from "../../services/trip-service";
import { POSITION_INTERVAL, TRIP_STATUS_GOING, TRIP_STATUS_FINISHED, SOS } from "../../services/constants";
import { PlaceService } from "../../services/place-service";

declare var google: any;

@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingPage {
  driver: any;
  map: any;
  trip: any = {};
  driverTracking: any;
  marker: any;
  tripStatus: any;
  sos: any;
  alertCnt: any = 0;

  constructor(public nav: NavController, public driverService: DriverService, public platform: Platform, public navParams: NavParams,public tripService: TripService, public placeService: PlaceService, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.sos = SOS;
  }

  ionViewDidLoad() {
    let tripId;
    if(this.navParams.get('tripId'))
      tripId = this.navParams.get('tripId')
    else
     tripId = this.tripService.getId();

    this.tripService.getTrip(tripId).take(1).subscribe(snapshot => {
      this.trip = snapshot;

      this.driverService.getDriver(snapshot.driverId).take(1).subscribe(snap => {
        console.log(snap);
        this.driver = snap;
        this.watchTrip(tripId);
        // init map
        this.loadMap();
      })
    });

  }

  ionViewWillLeave() {
    clearInterval(this.driverTracking);
  }

  watchTrip(tripId) {
      this.tripService.getTrip(tripId).subscribe(snapshot => {
        this.tripStatus = snapshot.status;
      });
  }
  showRateCard(){
    let final = this.trip.fee - (this.trip.fee *  (parseInt(this.trip.discount) / 100));
    let message = '<p>Fee: '+this.trip.fee+'<br>Promo: '+ this.trip.discount +'<br> Discount (%): '+this.trip.discount+'</p><h2>' + final +'</h3>';
      this.alertCtrl.create({
        title: 'Final Price ('+this.trip.currency+')',
        message: message,
        enableBackdropDismiss: false,
        buttons: [{
          text:'Rate Trip',
          handler: data => {
            this.showRatingAlert();
          }
        }],
      }).present();
  }

  showRatingAlert(){
    console.log(this.trip, this.driver);
    let alert = this.alertCtrl.create({
      title: 'Rate Trip',
      enableBackdropDismiss: false
    });
    alert.addInput({ type: 'radio', label: 'Excellent', value: '5', checked: true });
    alert.addInput({ type: 'radio', label: 'Good', value: '4' });
    alert.addInput({ type: 'radio', label: 'OK', value: '3' });
    alert.addInput({ type: 'radio', label: 'Bad', value: '2' });
    alert.addInput({ type: 'radio', label: 'Worst', value: '1' });

    alert.addButton({ text: 'Cancel', handler : ()=>{
      this.nav.setRoot(HomePage)
    }});
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.tripService.rateTrip(this.trip.$key, data).then(() => {
          this.nav.setRoot(HomePage)
        });
      }
    });
    alert.present();

  }

  loadMap() {
    let latLng = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    this.trackDriver();
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  trackDriver() {
    this.showDriverOnMap();

    this.driverTracking = setInterval(() => {
      this.marker.setMap(null);
      this.showDriverOnMap();
    }, POSITION_INTERVAL);

    console.log(POSITION_INTERVAL);
  }

  cancelTrip(){
    this.tripService.cancelTrip(this.trip.$key).then(data=>{
      console.log(data);
      this.nav.setRoot(HomePage);
    })
  }

  // show user on map
  showDriverOnMap() {
    // get user's position
    this.driverService.getDriverPosition(
        this.placeService.getLocality(),
        this.driver.type,
        this.driver.$key
    ).take(1).subscribe(snapshot => {
      // create or update
      let latLng = new google.maps.LatLng(snapshot.lat, snapshot.lng);

      if (this.tripStatus == TRIP_STATUS_GOING) {
        console.log(this.tripStatus);
        this.map.setCenter(latLng);
      }
      
      // show vehicle to map
      this.marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: {
          url: 'assets/img/icon/suv_right.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16),
          scaledSize: new google.maps.Size(32, 32)
        },
      });
    });
  }
}