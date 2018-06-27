webpackJsonp([0],{

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DealService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trip_service__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DealService = (function () {
    function DealService(db, tripService) {
        this.db = db;
        this.tripService = tripService;
    }
    DealService.prototype.getDeal = function (driverId) {
        return this.db.object('deals/' + driverId);
    };
    DealService.prototype.removeDeal = function (driverId) {
        return this.db.object('deals/' + driverId).remove();
    };
    // accept a deal
    DealService.prototype.acceptDeal = function (driverId, deal) {
        var _this = this;
        deal.driverId = driverId;
        // create trip from deal
        return this.tripService.createFromDeal(deal).then(function (trip) {
            _this.tripService.setCurrentTrip(trip.key);
            // set tripId to deal
            return _this.db.object('deals/' + driverId).update({
                status: __WEBPACK_IMPORTED_MODULE_2__constants__["e" /* DEAL_STATUS_ACCEPTED */],
                tripId: trip.key
            });
        });
    };
    DealService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_3__trip_service__["a" /* TripService */]])
    ], DealService);
    return DealService;
}());

//# sourceMappingURL=deal-service.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PickUpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_trip_service__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_deal_service__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PickUpPage = (function () {
    function PickUpPage(nav, tripService, alertCtrl, dealService) {
        var _this = this;
        this.nav = nav;
        this.tripService = tripService;
        this.alertCtrl = alertCtrl;
        this.dealService = dealService;
        this.passenger = {};
        this.isTripStarted = false;
        this.trip = tripService.getCurrentTrip();
        tripService.getTripStatus(this.trip.$key).subscribe(function (trip) {
            if (trip.status == 'canceled') {
                _this.alertCtrl.create({ title: 'Trip Canceled' }).present();
                _this.tripService.cancel(_this.trip.$key);
                _this.dealService.removeDeal(_this.trip.driverId);
                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
            }
        });
        tripService.getPassenger(this.trip.passengerId).take(1).subscribe(function (snapshot) {
            _this.passenger = snapshot;
        });
    }
    // pickup
    PickUpPage.prototype.pickup = function () {
        var _this = this;
        this.alertCtrl.create({
            title: "OTP",
            subTitle: "Please Enter OTP from customer",
            inputs: [{
                    name: 'otp',
                    placeholder: '4 digit OTP'
                }],
            buttons: [{
                    text: "Verify",
                    handler: function (data) {
                        console.log(data);
                        console.log(_this.trip.$key);
                        __WEBPACK_IMPORTED_MODULE_5_firebase__["database"]().ref('trips/' + _this.trip.$key).once('value', function (snap) {
                            console.log(snap.val());
                            if (snap.val().otp != data.otp) {
                                _this.alertCtrl.create({ title: 'Error', subTitle: 'Invalide OTP' }).present();
                            }
                            else {
                                _this.isTripStarted = true;
                                _this.tripService.pickUp(_this.trip.$key);
                            }
                        });
                    }
                }]
        }).present();
    };
    PickUpPage.prototype.getDirection = function (lat, lng) {
        console.log("call");
        var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Current Location&destination=" + lat + "," + lng;
        window.open(url);
    };
    PickUpPage.prototype.showPayment = function () {
        var _this = this;
        var final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100));
        this.alertCtrl.create({
            title: 'Trip Price (cash)',
            message: '<p> Total: ' + this.trip.currency + this.trip.fee + ' <br> Promo code: ' + this.trip.promocode + '<br> Discount (%): ' + this.trip.discount + '</p><h3>' + final + '</h3>',
            buttons: [
                {
                    text: 'OK',
                    handler: function () {
                        _this.tripService.dropOff(_this.trip.$key);
                        _this.dealService.removeDeal(_this.trip.driverId);
                        _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
                    }
                }
            ]
        }).present();
    };
    PickUpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-pick-up',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/pick-up/pick-up.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>{{\'RIDE_INFORMATION\' | translate}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-card>\n    <ion-card-content>\n      <ion-list>\n        <ion-item>\n          <h2>{{\'FROM\' | translate}}</h2>\n          <p>{{ trip.origin.vicinity }}</p>\n          <button item-right ion-button clear (click)="getDirection(trip.origin.location.lat,trip.origin.location.lng)">\n            <ion-icon name="navigate"></ion-icon>&nbsp; {{\'NAVIGATE\' | translate}}\n          </button>\n        </ion-item>\n        <ion-item (click)="getDirection(trip.destination.location.lat,trip.destination.location.lng)">\n          <h2>{{\'TO\' | translate}}</h2>\n          <p>{{ trip.destination.vicinity }}</p>\n          <button item-right clear ion-button (click)="getDirection(trip.destination.location.lat,trip.destination.location.lng)">\n            <ion-icon name="navigate"></ion-icon>&nbsp; {{\'NAVIGATE\' | translate}}\n          </button>\n        </ion-item>\n        <ion-item *ngIf="passenger.phoneNumber">\n          <h2>{{\'CALL\' | translate}}</h2>\n          <p>{{(passenger)?.phoneNumber }}</p>\n          <a href="tel:{{passenger.phoneNumber}}" ion-button clear item-right>\n            <ion-icon name="call"></ion-icon>&nbsp; {{\'CALL\' | translate}}\n          </a>\n        </ion-item>\n\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n  <ion-badge>{{ trip.payment_method }}</ion-badge>\n</ion-content>\n<ion-footer>\n  <button ion-button block clear [hidden]="isTripStarted" (click)="pickup()">{{\'PICKUP\' | translate}}</button>\n  <button ion-button block clear [hidden]="!isTripStarted" (click)="showPayment()">{{\'COMPLETE_RIDE\' | translate}}</button>\n</ion-footer>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/pick-up/pick-up.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__services_trip_service__["a" /* TripService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__services_deal_service__["a" /* DealService */]])
    ], PickUpPage);
    return PickUpPage;
}());

//# sourceMappingURL=pick-up.js.map

/***/ }),

/***/ 141:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 141;

/***/ }),

/***/ 183:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 183;

/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AuthService = (function () {
    function AuthService(afAuth, db) {
        this.afAuth = afAuth;
        this.db = db;
    }
    AuthService.prototype.getUserData = function () {
        return this.afAuth.auth.currentUser;
    };
    AuthService.prototype.getUser = function (id) {
        return this.db.object('drivers/' + id);
    };
    AuthService.prototype.login = function (email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password); // login with email & password
    };
    AuthService.prototype.logout = function () {
        return this.afAuth.auth.signOut(); // logout from firebase
    };
    // register new account
    AuthService.prototype.register = function (userInfo) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].create(function (observer) {
            _this.afAuth.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then(function (authData) {
                // update driver object
                userInfo.uid = authData.uid;
                userInfo.rating = __WEBPACK_IMPORTED_MODULE_5__constants__["l" /* DRIVER_INIT_RATING */];
                userInfo.balance = __WEBPACK_IMPORTED_MODULE_5__constants__["k" /* DRIVER_INIT_BALANCE */];
                userInfo.photoURL = __WEBPACK_IMPORTED_MODULE_5__constants__["h" /* DEFAULT_AVATAR */];
                userInfo.canRide = !__WEBPACK_IMPORTED_MODULE_5__constants__["a" /* APPROVAL_REQUIRED */];
                userInfo.isPhoneVerified = false;
                _this.getUserData().updateProfile({ displayName: userInfo.name, photoURL: __WEBPACK_IMPORTED_MODULE_5__constants__["h" /* DEFAULT_AVATAR */] });
                _this.db.object('drivers/' + userInfo.uid).update(userInfo);
                if (__WEBPACK_IMPORTED_MODULE_5__constants__["m" /* EMAIL_VERIFICATION_ENABLED */] === true)
                    _this.getUserData().sendEmailVerification();
                observer.next();
            }).catch(function (error) {
                if (error) {
                    observer.error(error);
                }
            });
        });
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], AuthService);
    return AuthService;
}());

//# sourceMappingURL=auth-service.js.map

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_setting_service__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(31);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var UserPage = (function () {
    function UserPage(nav, authService, navParams, loadingCtrl, settingService, alertCtrl, toastCtrl, platform, translate) {
        var _this = this;
        this.nav = nav;
        this.authService = authService;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.settingService = settingService;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.translate = translate;
        this.user = {};
        this.support = __WEBPACK_IMPORTED_MODULE_6__services_constants__["d" /* CUSTOMER_CARE */];
        this.tripCount = 0;
        this.totalEarning = 0;
        this.rating = 5;
        this.types = [];
        this.tabs = 'profile';
        var user = navParams.get('user');
        this.currency = __WEBPACK_IMPORTED_MODULE_6__services_constants__["c" /* CURRENCY_SYMBOL */];
        // list of vehicle types
        this.settingService.getVehicleType().take(1).subscribe(function (snapshot) {
            console.log(snapshot);
            if (snapshot.$value === null) {
                _this.settingService.getDefaultVehicleType().take(1).subscribe(function (snapshot) {
                    _this.types = Object.keys(snapshot);
                    console.log(_this.types);
                });
            }
            else {
                _this.types = Object.keys(snapshot);
            }
        });
        this.authService.getUser(user.uid).take(1).subscribe(function (snapshot) {
            snapshot.uid = snapshot.$key;
            _this.user = snapshot;
            _this.rating = _this.user.rating;
            _this.getTrips();
        });
        this.user.isEmailVerified = __WEBPACK_IMPORTED_MODULE_3_firebase__["auth"]().currentUser.emailVerified;
        console.log(this.user);
    }
    UserPage.prototype.save = function () {
        var _this = this;
        this.authService.getUser(this.user.uid).update(this.user).then(function (data) {
            _this.displayToast("Updated successfully");
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__home_home__["a" /* HomePage */]);
        });
    };
    UserPage.prototype.chooseFile = function () { document.getElementById('avatar').click(); };
    UserPage.prototype.upload = function () {
        var _this = this;
        // Create a root reference
        var storageRef = __WEBPACK_IMPORTED_MODULE_3_firebase__["storage"]().ref();
        var loading = this.loadingCtrl.create({ content: 'Please wait...' });
        loading.present();
        for (var _i = 0, _a = [document.getElementById('avatar').files[0]]; _i < _a.length; _i++) {
            var selectedFile = _a[_i];
            var path = '/users/' + Date.now() + ("" + selectedFile.name);
            var iRef = storageRef.child(path);
            iRef.put(selectedFile).then(function (snapshot) {
                loading.dismiss();
                _this.user.photoURL = snapshot.downloadURL;
                _this.save();
            });
        }
    };
    // code for uploading licence image
    UserPage.prototype.chooseDocs = function () {
        document.getElementById('docsPDF').click();
    };
    UserPage.prototype.uploadDocs = function () {
        var _this = this;
        var storageRef = __WEBPACK_IMPORTED_MODULE_3_firebase__["storage"]().ref();
        var loading = this.loadingCtrl.create({ content: 'Please wait...' });
        loading.present();
        for (var _i = 0, _a = [document.getElementById('docsPDF').files[0]]; _i < _a.length; _i++) {
            var selectedFile = _a[_i];
            var path = '/users/' + Date.now() + ("" + selectedFile.name);
            var iRef = storageRef.child(path);
            iRef.put(selectedFile).then(function (snapshot) {
                loading.dismiss();
                _this.user.docsURL = snapshot.downloadURL;
            });
        }
    };
    // show alert with message
    UserPage.prototype.showAlert = function (message) {
        var alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    UserPage.prototype.getTrips = function () {
        var _this = this;
        console.log(this.user.uid);
        var ref = __WEBPACK_IMPORTED_MODULE_3_firebase__["database"]().ref('trips');
        ref.orderByChild("driverId").equalTo(this.user.uid).on('value', function (snapshot) {
            console.log(snapshot.val());
            var tmp = [];
            var earning = 0;
            snapshot.forEach(function (snap) {
                if (snap.val().status === 'finished') {
                    earning += parseFloat(snap.val().fee);
                    var trip = __assign({ key: snap.key }, snap);
                    tmp.push(trip);
                }
                return false;
            });
            _this.tripCount = tmp.length;
            _this.totalEarning = earning;
        });
    };
    UserPage.prototype.logout = function () {
        var _this = this;
        this.authService.logout().then(function () {
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
        });
    };
    UserPage.prototype.verifyPhone = function () {
        var _this = this;
        if (this.platform.is('core')) {
            this.displayToast("Only Works on Device");
        }
        else {
            console.log(this.user.phoneNumber);
            window.AccountKitPlugin.loginWithPhoneNumber({
                useAccessToken: true,
                defaultCountryCode: __WEBPACK_IMPORTED_MODULE_6__services_constants__["i" /* DEFAULT_COUNTRY_CODE */],
                facebookNotificationsEnabled: true,
                initialPhoneNumber: [__WEBPACK_IMPORTED_MODULE_6__services_constants__["j" /* DEFAULT_COUNTRY_MOBILE_CODE */], this.user.phoneNumber]
            }, function (data) {
                _this.displayToast("Verified Successfully");
                _this.user.isPhoneVerified = true;
                //this.authService.updateUserProfile(this.user);
            });
        }
    };
    UserPage.prototype.verifyEmail = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3_firebase__["auth"]().currentUser.sendEmailVerification().then(function (data) {
            _this.displayToast("Please check your inbox");
        }).catch(function (err) { return console.log(err); });
    };
    UserPage.prototype.displayToast = function (message) {
        this.toastCtrl.create({ duration: 2000, message: message }).present();
    };
    UserPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-user',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/user/user.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>{{ user.name }}</ion-title>\n    <ion-buttons end>\n      <a href="tel:{{support}}" ion-button block clear>{{\'HELP\' | translate}}</a>\n      <button ion-button (click)="logout()">\n        <ion-icon name="log-out"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <ion-segment [(ngModel)]="tabs">\n    <ion-segment-button value="profile">\n      {{\'BASIC_PROFILE\' | translate}}\n    </ion-segment-button>\n    <ion-segment-button value="carinfo">\n      {{\'CAR_INFO\' | translate }}\n    </ion-segment-button>\n    <ion-segment-button value="uploaddocs">\n      {{\'UPLOAD_DOCS\' | translate}}\n    </ion-segment-button>\n  </ion-segment>\n  <div [ngSwitch]="tabs" padding>\n    <div *ngSwitchCase="\'profile\'">\n      <div style="text-align: center;">\n        <img src="{{ user.photoURL }}" style="width:50px;height:50px;border-radius:100px" (click)="chooseFile()">\n        <form ngNoForm>\n          <input id="avatar" name="file" type="file" (change)="upload()">\n        </form>\n      </div>\n      <ion-list>\n        <ion-item>\n          <ion-label stacked>{{\'FULLNAME\' | translate}}</ion-label>\n          <ion-input type="text" [(ngModel)]="user.name" placeholder="{{\'FULLNAME\' | translate}}"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{\'EMAIL_ADDRESS\' | translate}}</ion-label>\n          <ion-input type="email" [(ngModel)]="user.email" disabled placeholder="{{\'EMAIL_ADDRESS\' | translate}}"></ion-input>\n          <button ion-button item-right clear *ngIf="!user.isEmailVerified" (click)="verifyEmail()">{{\'VERIFY\' | translate}}</button>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{\'PHONE_NUMBER\' | translate}}</ion-label>\n          <ion-input type="tel" [(ngModel)]="user.phoneNumber" [disabled]="user.isPhoneVerified" placeholder="{{\'PHONE_NUMBER\' | translate}}"></ion-input>\n          <button ion-button item-right clear *ngIf="!user.isPhoneVerified" (click)="verifyPhone()">{{\'VERIFY\' | translate}}</button>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{\'BANK_DETAILS\' | translate}}</ion-label>\n          <ion-textarea [(ngModel)]="user.bankinfo"></ion-textarea>\n        </ion-item>\n      </ion-list>\n    </div>\n    <div *ngSwitchCase="\'carinfo\'">\n      <ion-list>\n        <ion-item>\n            <ion-label stacked>{{\'CAR_BRAND\' | translate}}</ion-label>\n          <ion-input type="text" [(ngModel)]="user.brand" placeholder="{{\'CAR_BRAND\' | translate}}"></ion-input>\n        </ion-item>\n        <ion-item>\n            <ion-label stacked>{{\'CAR_MODEL\' | translate}}</ion-label>\n          <ion-input type="text" [(ngModel)]="user.model" placeholder="{{\'CAR_MODEL\' | translate}}"></ion-input>\n        </ion-item>\n        <ion-item>\n            <ion-label stacked>{{\'PLATE_NUMBER\' | translate}}</ion-label>\n          <ion-input type="text" [(ngModel)]="user.plate" placeholder="{{\'PLATE_NUMBER\' | translate}}"></ion-input>\n        </ion-item>\n        <ion-item *ngIf="types">\n          <ion-label stacked>{{\'CAR_TYPE\' | translate}}</ion-label>\n          <ion-select [(ngModel)]="user.type">\n            <ion-option value="{{ type }}" *ngFor="let type of types">\n              {{ type }}\n            </ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-list>\n    </div>\n    <div *ngSwitchCase="\'uploaddocs\'">\n      <p *ngIf="user.docsURL">Your Uploaded File:\n        <a href="{{user.docsURL}}" target="_blank">{{\'DOWNLOAD\' | translate}} PDF</a>\n      </p>\n\n      <p text-center>please upload your scanned copies of licence, insurance, car images as single pdf</p>\n\n      <button ion-button block item-right (click)="chooseDocs()">{{\'UPLOAD\' | translate}} PDF</button>\n      <div>\n        <form ngNoForm>\n          <input id="docsPDF" name="file" type="file" (change)="uploadDocs()">\n        </form>\n      </div>\n    </div>\n  </div>\n</ion-content>\n<ion-footer style="padding: 5px;">\n  <button ion-button block (click)="save()">{{\'SAVE\' | translate}}</button>\n</ion-footer>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/user/user.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__services_setting_service__["a" /* SettingService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */]])
    ], UserPage);
    return UserPage;
}());

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__place_service__ = __webpack_require__(69);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SettingService = (function () {
    function SettingService(db, storage, placeService) {
        this.db = db;
        this.storage = storage;
        this.placeService = placeService;
    }
    SettingService.prototype.getVehicleType = function () {
        return this.db.object('master_settings/prices/' + this.placeService.getLocality() + '/vehicles');
    };
    SettingService.prototype.getDefaultVehicleType = function () {
        return this.db.object('master_settings/prices/default/vehicles');
    };
    SettingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_3__place_service__["a" /* PlaceService */]])
    ], SettingService);
    return SettingService;
}());

//# sourceMappingURL=setting-service.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_login__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var RegisterPage = (function () {
    function RegisterPage(nav, authService, alertCtrl, loadingCtrl, translate) {
        this.nav = nav;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.userInfo = {};
    }
    RegisterPage.prototype.signup = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: 'Creating Account...' });
        loading.present();
        this.authService.register(this.userInfo).subscribe(function (authData) {
            loading.dismiss();
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
        }, function (error) {
            loading.dismiss();
            _this.alertCtrl.create({ message: error.message, buttons: ['OK'] }).present();
        });
    };
    RegisterPage.prototype.login = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_2__login_login__["a" /* LoginPage */]);
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-register',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/register/register.html"*/'<ion-content>\n  <!-- Logo -->\n  <div padding text-center class="header">\n    <div class="logo secondary-bg">\n      <!-- <img src="assets/img/login.png" /> -->\n      <ion-icon name="ios-car" color="light"></ion-icon>\n    </div>\n    <h2 ion-text color="light">{{\'REGISTER\' | translate}}</h2>\n  </div>\n  <ion-list class="list-form" padding>\n    <ion-item>\n      <ion-label stacked>{{\'FULLNAME\'| translate}}</ion-label>\n      <ion-input type="text" [(ngModel)]="userInfo.name"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>{{\'EMAIL_ADDRESS\'| translate}}</ion-label>\n      <ion-input type="email" [(ngModel)]="userInfo.email" ></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>{{\'PASSWORD\'| translate}} (MIN 6 CHAR)</ion-label>\n      <ion-input type="password" [(ngModel)]="userInfo.password"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>{{\'PHONE_NUMBER\'| translate}}</ion-label>\n      <ion-input type="tel" [(ngModel)]="userInfo.phoneNumber"></ion-input>\n    </ion-item>\n    <ion-item>\n      <button ion-button padding block (click)="signup()">{{\'REGISTER\' | translate}}</button>\n    </ion-item>\n  </ion-list>\n</ion-content>\n<ion-footer>\n  <button ion-button clear block (click)="login()">{{\'LOGIN\' | translate }}</button>\n</ion-footer>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/register/register.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_transaction_service__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_driver_service__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var WalletPage = (function () {
    function WalletPage(nav, transactionService, translate, driverService, alertCtrl, toastCtrl) {
        var _this = this;
        this.nav = nav;
        this.transactionService = transactionService;
        this.translate = translate;
        this.driverService = driverService;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.currency = __WEBPACK_IMPORTED_MODULE_4__services_constants__["c" /* CURRENCY_SYMBOL */];
        // get transactions from service
        transactionService.getTransactions().subscribe(function (snapshot) {
            _this.records = snapshot.reverse();
        });
        driverService.getDriver().subscribe(function (snapshot) {
            _this.driver = snapshot;
        });
    }
    WalletPage.prototype.withdraw = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Make a withdraw',
            message: "",
            inputs: [
                {
                    name: 'amount',
                    placeholder: 'Amount'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Submit',
                    handler: function (data) {
                        if (data.amount > _this.driver.balance) {
                            var alert_1 = _this.alertCtrl.create({
                                title: 'Error',
                                message: 'Your balance is not enough',
                                buttons: ['OK']
                            });
                            return alert_1.present();
                        }
                        _this.transactionService.widthDraw(data.amount, _this.driver.balance).then(function () {
                            var toast = _this.toastCtrl.create({
                                message: 'Withdraw is successfully',
                                duration: 3000,
                                position: 'middle'
                            });
                            toast.present();
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    WalletPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-wallet',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/wallet/wallet.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>{{\'WALLET\' | translate}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div class="widhdraw-header">\n    <h2 style="font-size: 4rem;">{{currency}} {{ (driver)?.balance }}</h2>\n    <button ion-button color="light" (click)="withdraw()">{{\'WITHDRAW\' | translate}}</button>\n  </div>\n  <ion-list>\n    <ion-item-divider>\n      {{\'HISTORY\' | translate}}\n    </ion-item-divider>\n    <ion-item no-border *ngFor="let record of records">\n      <h2>Txn ID: {{record.$key}}</h2>\n      <p>{{ record.type }} - {{ record.createdAt | amDateFormat: \'YYYY-MM-DD HH:mm\'}}</p>\n      <ion-note item-right>{{currency}} {{ record.amount }}</ion-note>\n    </ion-item>\n  </ion-list>\n</ion-content>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/wallet/wallet.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__services_transaction_service__["a" /* TransactionService */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_3__services_driver_service__["a" /* DriverService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */]])
    ], WalletPage);
    return WalletPage;
}());

//# sourceMappingURL=wallet.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TransactionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TransactionService = (function () {
    function TransactionService(db, authService) {
        this.db = db;
        this.authService = authService;
    }
    TransactionService.prototype.getTransactions = function () {
        var user = this.authService.getUserData();
        return this.db.list('transactions/' + user.uid);
    };
    TransactionService.prototype.widthDraw = function (amount, balance) {
        var _this = this;
        var user = this.authService.getUserData();
        return this.db.list('transactions/' + user.uid).push({
            amount: amount,
            createdAt: Date.now(),
            type: __WEBPACK_IMPORTED_MODULE_3__constants__["q" /* TRANSACTION_TYPE_WITHDRAW */]
        }).then(function () {
            _this.db.object('drivers/' + user.uid).update({
                balance: balance - amount
            });
        });
    };
    TransactionService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]])
    ], TransactionService);
    return TransactionService;
}());

//# sourceMappingURL=transaction-service.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobHistoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_report_service__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_trip_service__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var JobHistoryPage = (function () {
    function JobHistoryPage(nav, tripService, reportService, translate) {
        var _this = this;
        this.nav = nav;
        this.tripService = tripService;
        this.reportService = reportService;
        this.translate = translate;
        // statistic
        this.stats = {
            today: 0,
            yesterday: 0,
            thisMonth: 0,
            lastMonth: 0,
            thisYear: 0,
            lastYear: 0
        };
        reportService.getAll().take(1).subscribe(function (snapshot) {
            console.log(snapshot);
            var today = new Date();
            var lastYear = today.getFullYear() - 1;
            var lastMonth = (today.getMonth() > 0) ? today.getMonth() : 12;
            var yesterday = new Date(Date.now() - 86400000);
            var thisYear = today.getFullYear();
            var thisMonth = today.getMonth() + 1;
            // get current
            if (snapshot[thisYear]) {
                _this.stats.thisYear = snapshot[thisYear].total;
                if (snapshot[thisYear][thisMonth]) {
                    _this.stats.thisMonth = snapshot[thisYear][thisMonth].total;
                    if (snapshot[thisYear][thisMonth][today.getDate()]) {
                        _this.stats.today = snapshot[thisYear][thisMonth][today.getDate()].total;
                    }
                }
                if ((lastMonth != 12) && snapshot[thisYear][lastMonth]) {
                    _this.stats.lastMonth = snapshot[thisYear][lastMonth].total;
                }
            }
            // get last year & last month data
            if (snapshot[lastYear]) {
                _this.stats.lastYear = snapshot[lastYear].total;
                if ((lastMonth == 12) && snapshot[lastYear][lastMonth]) {
                    _this.stats.lastMonth = snapshot[lastYear][lastMonth].total;
                }
            }
            // get yesterday's data
            if (snapshot[yesterday.getFullYear()]
                && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1]
                && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()]) {
                _this.stats.yesterday = snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()].total;
            }
        });
        this.tripService.getTrips().take(1).subscribe(function (snapshot) {
            _this.trips = snapshot.reverse();
        });
    }
    JobHistoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-job-history',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/job-history/job-history.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{\'HISTORY\' | translate}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <ion-slides pager>\n      <ion-slide>\n        <h1>{{ stats.today }}</h1>\n        <p>Today</p>\n      </ion-slide>\n      <ion-slide>\n          <h1>{{ stats.yesterday }}</h1>\n          <p>Yesterday</p>\n      </ion-slide>\n      <ion-slide>\n          <h1>{{ stats.thisMonth }}</h1>\n          <p>This Month</p>\n      </ion-slide>\n      <ion-slide>\n          <h1>{{ stats.lastMonth }}</h1>\n          <p>Last Month</p>\n      </ion-slide>\n      <ion-slide>\n          <h1>{{ stats.thisYear }}</h1>\n          <p>This Year</p>\n      </ion-slide>\n      <ion-slide>\n          <h1>{{ stats.lastYear }}</h1>\n          <p>Last Year</p>\n      </ion-slide>\n    </ion-slides>\n  <ion-card *ngFor="let trip of trips">\n    <ion-card-content>\n      <p>{{trip.$key}}</p>\n      <ion-row>\n        <ion-col>\n          <b style="text-align:center">FROM</b> \n          <p>{{ trip.origin.vicinity }} <br/> <ion-note>{{ trip.pickedUpAt | amDateFormat: \'YYYY-MM-DD HH:mm\'}}</ion-note></p>\n        </ion-col>\n        <ion-col>\n            <b style="text-align:center">TO</b> \n            <p>{{ trip.destination.vicinity }} <br/> <ion-note>{{ trip.droppedOffAt | amDateFormat: \'YYYY-MM-DD HH:mm\'}}</ion-note></p>\n        </ion-col>\n      </ion-row>\n      <p>Payment Mode: {{ trip.paymentMethod }}</p>\n      <p>Fee: {{trip.currency}} {{trip.fee}} * {{ trip.promo}} {{trip.discount}} % = {{ trip.fee - (trip.fee * trip.discount / 100) }}</p>\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/job-history/job-history.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__services_trip_service__["a" /* TripService */], __WEBPACK_IMPORTED_MODULE_2__services_report_service__["a" /* ReportService */], __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */]])
    ], JobHistoryPage);
    return JobHistoryPage;
}());

//# sourceMappingURL=job-history.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReportService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ReportService = (function () {
    function ReportService(db, authService) {
        this.db = db;
        this.authService = authService;
    }
    ReportService.prototype.getAll = function () {
        var user = this.authService.getUserData();
        return this.db.object('reports/' + user.uid);
    };
    ReportService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]])
    ], ReportService);
    return ReportService;
}());

//# sourceMappingURL=report-service.js.map

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return POSITION_INTERVAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return DRIVER_INIT_BALANCE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return DRIVER_INIT_RATING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return DEAL_STATUS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return DEAL_STATUS_ACCEPTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return DEAL_TIMEOUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return TRIP_STATUS_WAITING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return TRIP_STATUS_GOING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return TRIP_STATUS_FINISHED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return TRIP_STATUS_CANCELED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return TRANSACTION_TYPE_WITHDRAW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return DEFAULT_COUNTRY_CODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return DEFAULT_COUNTRY_MOBILE_CODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return EMAIL_VERIFICATION_ENABLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APPROVAL_REQUIRED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CURRENCY_SYMBOL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return ENABLE_SIGNUP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return PLAY_AUDIO_ON_REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AUDIO_PATH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return DEFAULT_AVATAR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return CUSTOMER_CARE; });
var POSITION_INTERVAL = 5000; // 5000ms for refreshing geolocation
var DRIVER_INIT_BALANCE = 10; // balance when user signed up for first time
var DRIVER_INIT_RATING = 5; // rating when user signedup for first time
var DEAL_STATUS_PENDING = 'pending';
var DEAL_STATUS_ACCEPTED = 'accepted';
var DEAL_TIMEOUT = 20; // 20 seconds
var TRIP_STATUS_WAITING = 'waiting';
var TRIP_STATUS_GOING = 'going';
var TRIP_STATUS_FINISHED = 'finished';
var TRIP_STATUS_CANCELED = 'canceled';
var TRANSACTION_TYPE_WITHDRAW = 'withdraw';
// Global Settings
var DEFAULT_COUNTRY_CODE = "IN"; // used in AccountKit Mobile verification
var DEFAULT_COUNTRY_MOBILE_CODE = "+91";
var EMAIL_VERIFICATION_ENABLED = true; // send verification email after user register
var APPROVAL_REQUIRED = false; // driver can ride without any approval
var CURRENCY_SYMBOL = "$";
var ENABLE_SIGNUP = true;
var PLAY_AUDIO_ON_REQUEST = true;
var AUDIO_PATH = "./assets/audio/sound.mp3"; //must have mp3 file
var DEFAULT_AVATAR = 'https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png';
var CUSTOMER_CARE = "1234567890";
/*
    !!! Important update !!!
    Please update your firebase configurations on src/app/app.module.ts
*/ 
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(401);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* unused harmony export firebaseConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_storage__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angularfire2__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_angularfire2_database__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angularfire2_auth__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angular2_moment__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_angular2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_driver_service__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_report_service__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_transaction_service__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_place_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_deal_service__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_trip_service__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services_setting_service__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_job_history_job_history__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_login_login__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_pick_up_pick_up__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_register_register__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_wallet_wallet__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_user_user__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__angular_common_http__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ngx_translate_core__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ngx_translate_http_loader__ = __webpack_require__(498);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























// end import pages



function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_30__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/lang/', '.json');
}
// AF2 Settings
var firebaseConfig = {
    apiKey: "AIzaSyA53cAEXLay6O1rPP7uG4myD3vMHGdvL4U",
    authDomain: "fleet-23516.firebaseapp.com",
    databaseURL: "https://fleet-23516.firebaseio.com",
    projectId: "fleet-23516",
    storageBucket: "fleet-23516.appspot.com",
    messagingSenderId: "420455656383"
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_21__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_job_history_job_history__["a" /* JobHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_pick_up_pick_up__["a" /* PickUpPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_wallet_wallet__["a" /* WalletPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_user_user__["a" /* UserPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_29__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_29__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_28__angular_common_http__["a" /* HttpClient */]]
                    }
                }),
                __WEBPACK_IMPORTED_MODULE_9_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_10_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_11_angularfire2_auth__["b" /* AngularFireAuthModule */],
                __WEBPACK_IMPORTED_MODULE_12_angular2_moment__["MomentModule"],
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */], {
                    mode: 'md'
                }, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_21__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_job_history_job_history__["a" /* JobHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_pick_up_pick_up__["a" /* PickUpPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_wallet_wallet__["a" /* WalletPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_user_user__["a" /* UserPage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_13__services_driver_service__["a" /* DriverService */],
                __WEBPACK_IMPORTED_MODULE_14__services_report_service__["a" /* ReportService */],
                __WEBPACK_IMPORTED_MODULE_15__services_transaction_service__["a" /* TransactionService */],
                __WEBPACK_IMPORTED_MODULE_16__services_place_service__["a" /* PlaceService */],
                __WEBPACK_IMPORTED_MODULE_17__services_deal_service__["a" /* DealService */],
                __WEBPACK_IMPORTED_MODULE_18__services_trip_service__["a" /* TripService */],
                __WEBPACK_IMPORTED_MODULE_19__services_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_20__services_setting_service__["a" /* SettingService */],
                /* import services */
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_driver_service__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_deal_service__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_place_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pick_up_pick_up__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__user_user__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__wallet_wallet__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__job_history_job_history__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_geolocation__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ngx_translate_core__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var HomePage = (function () {
    function HomePage(nav, driverService, modalCtrl, alertCtrl, dealService, authService, placeService, geolocation, translate) {
        this.nav = nav;
        this.driverService = driverService;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.dealService = dealService;
        this.authService = authService;
        this.placeService = placeService;
        this.geolocation = geolocation;
        this.translate = translate;
        this.isDriverAvailable = false;
        this.dealStatus = false;
        this.remainingTime = __WEBPACK_IMPORTED_MODULE_3__services_constants__["g" /* DEAL_TIMEOUT */];
    }
    HomePage.prototype.loadMap = function (lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
        });
        new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
    };
    HomePage.prototype.changeAvailability = function () {
        var _this = this;
        console.log(this.isDriverAvailable);
        if (this.isDriverAvailable == true) {
            // get current location
            this.geolocation.getCurrentPosition().then(function (resp) {
                var latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
                var geocoder = new google.maps.Geocoder();
                _this.loadMap(resp.coords.latitude, resp.coords.longitude);
                // find address from lat lng
                geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        // save locality
                        var locality_1 = _this.placeService.setLocalityFromGeocoder(results);
                        console.log('locality', locality_1);
                        // start tracking
                        _this.positionTracking = setInterval(function () {
                            // check for driver object, if it did not complete profile, stop updating location
                            console.log("pos track");
                            if (!_this.driver || !_this.driver.type) {
                                return;
                            }
                            // Immediate update
                            _this.driverService.updatePosition(_this.driver.$key, _this.driver.type, locality_1, resp.coords.latitude, resp.coords.longitude, _this.driver.rating, _this.driver.name);
                            // Periodic update after particular time intrvel
                            _this.geolocation.getCurrentPosition().then(function (resp) {
                                console.log(resp);
                                _this.driverService.updatePosition(_this.driver.$key, _this.driver.type, locality_1, resp.coords.latitude, resp.coords.longitude, _this.driver.rating, _this.driver.name);
                            }, function (err) {
                                console.log(err);
                            });
                        }, __WEBPACK_IMPORTED_MODULE_3__services_constants__["p" /* POSITION_INTERVAL */]);
                        _this.watchDeals();
                    }
                });
            }, function (err) {
                console.log(err);
            });
        }
        else {
            clearInterval(this.positionTracking);
            if (this.dealSubscription) {
                // unsubscribe when leave this page
                this.dealSubscription.unsubscribe();
            }
        }
    };
    HomePage.prototype.ionViewWillLeave = function () {
        if (this.dealSubscription) {
            // unsubscribe when leave this page
            this.dealSubscription.unsubscribe();
        }
    };
    // count down
    HomePage.prototype.countDown = function () {
        var _this = this;
        var interval = setInterval(function () {
            _this.remainingTime--;
            if (_this.remainingTime == 0) {
                clearInterval(interval);
                _this.cancelDeal();
                _this.remainingTime = __WEBPACK_IMPORTED_MODULE_3__services_constants__["g" /* DEAL_TIMEOUT */];
            }
        }, 1000);
        this.confirmJob();
    };
    HomePage.prototype.cancelDeal = function () {
        console.log("close");
        this.dealStatus = false;
        this.dealService.removeDeal(this.driver.$key);
    };
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.driverService.getDriver().take(1).subscribe(function (snapshot) {
            _this.driver = snapshot;
            if (!_this.driver.plate && !_this.driver.type) {
                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__user_user__["a" /* UserPage */], {
                    user: _this.authService.getUserData()
                });
            }
        });
    };
    HomePage.prototype.range = function (n) {
        return new Array(Math.round(n));
    };
    // confirm a job
    HomePage.prototype.confirmJob = function () {
        var _this = this;
        console.log("confirm");
        var message = "<b>From:<b>" + this.job.origin.vicinity + " - " + this.job.origin.distance + "Km <br/> <b>To:</b>" + this.job.destination.vicinity + " - " + this.job.destination.distance;
        var confirm = this.alertCtrl.create({
            title: 'New Request',
            message: message,
            buttons: [
                {
                    text: 'Reject',
                    handler: function () {
                        console.log('Disagree clicked');
                        _this.dealStatus = false;
                        _this.dealService.removeDeal(_this.driver.$key);
                    }
                },
                {
                    text: 'Accept',
                    handler: function () {
                        _this.dealStatus = false;
                        _this.dealService.acceptDeal(_this.driver.$key, _this.deal).then(function () {
                            // go to pickup page
                            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pick_up_pick_up__["a" /* PickUpPage */]);
                        });
                    }
                }
            ]
        });
        confirm.present();
        this.playAudio();
    };
    // listen to deals
    HomePage.prototype.watchDeals = function () {
        var _this = this;
        // listen to deals
        this.dealSubscription = this.dealService.getDeal(this.driver.$key).subscribe(function (snapshot) {
            _this.deal = snapshot;
            if (snapshot.status == __WEBPACK_IMPORTED_MODULE_3__services_constants__["f" /* DEAL_STATUS_PENDING */]) {
                // if deal expired
                if (snapshot.createdAt < (Date.now() - __WEBPACK_IMPORTED_MODULE_3__services_constants__["g" /* DEAL_TIMEOUT */] * 1000)) {
                    return _this.dealService.removeDeal(_this.driver.$key);
                }
                _this.dealStatus = true;
                console.log(_this.dealStatus);
                _this.job = snapshot;
                _this.geolocation.getCurrentPosition().then(function (resp) {
                    //resp.coords.longitude
                    _this.job.origin.distance = _this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, _this.job.origin.location.lat, _this.job.origin.location.lng).toFixed(0);
                    _this.job.destination.distance = _this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, _this.job.destination.location.lat, _this.job.destination.location.lng).toFixed(0);
                    _this.countDown();
                }, function (err) {
                    console.log(err);
                });
            }
        });
    };
    HomePage.prototype.goProfile = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__user_user__["a" /* UserPage */], { user: this.authService.getUserData() });
    };
    HomePage.prototype.goWallet = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_9__wallet_wallet__["a" /* WalletPage */]);
    };
    HomePage.prototype.goHistory = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_10__job_history_job_history__["a" /* JobHistoryPage */]);
    };
    HomePage.prototype.playAudio = function () {
        if (__WEBPACK_IMPORTED_MODULE_3__services_constants__["o" /* PLAY_AUDIO_ON_REQUEST */] == true) {
            var audio = new Audio(__WEBPACK_IMPORTED_MODULE_3__services_constants__["b" /* AUDIO_PATH */]);
            audio.play();
        }
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/home/home.html"*/'<ion-content>\n  <div id="map" style="height: 100%;width:100%;"></div>\n</ion-content>\n<ion-footer>\n  <ion-item>\n    <ion-avatar item-left>\n      <img src="{{ (driver)?.photoURL}}">\n    </ion-avatar>\n    <ion-label>{{ (driver)?.name }} - {{ (driver)?.rating }}\n      <ion-icon name="md-star"></ion-icon>\n    </ion-label>\n    <ion-toggle item-right [(ngModel)]="isDriverAvailable" (ionChange)="changeAvailability()"></ion-toggle>\n  </ion-item>\n  <ion-row>\n    <ion-col>\n      <button ion-button clear (click)="goWallet()">\n        <ion-icon name="card"></ion-icon>&nbsp;{{\'WALLET\' | translate}}</button>\n    </ion-col>\n    <ion-col>\n      <button ion-button clear (click)="goHistory()">\n        <ion-icon name="clock"></ion-icon>&nbsp;{{\'HISTORY\' | translate}}</button>\n    </ion-col>\n    <ion-col>\n      <button ion-button clear (click)="goProfile()">\n        <ion-icon name="contact"></ion-icon>&nbsp;{{\'PROFILE\' | translate}}</button>\n    </ion-col>\n  </ion-row>\n</ion-footer>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__services_driver_service__["a" /* DriverService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__services_deal_service__["a" /* DealService */], __WEBPACK_IMPORTED_MODULE_5__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_6__services_place_service__["a" /* PlaceService */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_12__ngx_translate_core__["c" /* TranslateService */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 442:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth_auth__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_place_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_driver_service__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_login_login__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_trip_service__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_pick_up_pick_up__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_constants__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// angularfire2

// import service




// import page





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, placeService, driverService, afAuth, authService, tripService, translate) {
        var _this = this;
        this.authService = authService;
        this.translate = translate;
        this.user = {};
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            // check for login stage, then redirect
            afAuth.authState.take(1).subscribe(function (authData) {
                if (authData) {
                    var root_1 = __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */];
                    // check for uncompleted trip
                    tripService.getTrips().take(1).subscribe(function (trips) {
                        trips.forEach(function (trip) {
                            if (trip.status == __WEBPACK_IMPORTED_MODULE_13__services_constants__["u" /* TRIP_STATUS_WAITING */] || trip.status == __WEBPACK_IMPORTED_MODULE_13__services_constants__["t" /* TRIP_STATUS_GOING */]) {
                                tripService.setCurrentTrip(trip.$key);
                                root_1 = __WEBPACK_IMPORTED_MODULE_12__pages_pick_up_pick_up__["a" /* PickUpPage */];
                            }
                        });
                        // if all trip are completed, go to home page
                        _this.nav.setRoot(root_1);
                    });
                }
                else {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_login_login__["a" /* LoginPage */]);
                }
            });
            // get user data
            afAuth.authState.subscribe(function (authData) {
                console.log(authData);
                if (authData) {
                    _this.user = authService.getUserData();
                    // get user info from service
                    driverService.setUser(_this.user);
                    driverService.getDriver().subscribe(function (snapshot) {
                        _this.driver = snapshot;
                    });
                }
                else {
                    _this.driver = null;
                }
            });
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/app/app.html"*/'<ion-nav [root]="rootPage" #content></ion-nav>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/app/app.html"*/,
            queries: {
                nav: new __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]('content')
            }
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_6__services_place_service__["a" /* PlaceService */],
            __WEBPACK_IMPORTED_MODULE_7__services_driver_service__["a" /* DriverService */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_5__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_11__services_trip_service__["a" /* TripService */], __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 248,
	"./af.js": 248,
	"./ar": 249,
	"./ar-dz": 250,
	"./ar-dz.js": 250,
	"./ar-kw": 251,
	"./ar-kw.js": 251,
	"./ar-ly": 252,
	"./ar-ly.js": 252,
	"./ar-ma": 253,
	"./ar-ma.js": 253,
	"./ar-sa": 254,
	"./ar-sa.js": 254,
	"./ar-tn": 255,
	"./ar-tn.js": 255,
	"./ar.js": 249,
	"./az": 256,
	"./az.js": 256,
	"./be": 257,
	"./be.js": 257,
	"./bg": 258,
	"./bg.js": 258,
	"./bm": 259,
	"./bm.js": 259,
	"./bn": 260,
	"./bn.js": 260,
	"./bo": 261,
	"./bo.js": 261,
	"./br": 262,
	"./br.js": 262,
	"./bs": 263,
	"./bs.js": 263,
	"./ca": 264,
	"./ca.js": 264,
	"./cs": 265,
	"./cs.js": 265,
	"./cv": 266,
	"./cv.js": 266,
	"./cy": 267,
	"./cy.js": 267,
	"./da": 268,
	"./da.js": 268,
	"./de": 269,
	"./de-at": 270,
	"./de-at.js": 270,
	"./de-ch": 271,
	"./de-ch.js": 271,
	"./de.js": 269,
	"./dv": 272,
	"./dv.js": 272,
	"./el": 273,
	"./el.js": 273,
	"./en-au": 274,
	"./en-au.js": 274,
	"./en-ca": 275,
	"./en-ca.js": 275,
	"./en-gb": 276,
	"./en-gb.js": 276,
	"./en-ie": 277,
	"./en-ie.js": 277,
	"./en-il": 278,
	"./en-il.js": 278,
	"./en-nz": 279,
	"./en-nz.js": 279,
	"./eo": 280,
	"./eo.js": 280,
	"./es": 281,
	"./es-do": 282,
	"./es-do.js": 282,
	"./es-us": 283,
	"./es-us.js": 283,
	"./es.js": 281,
	"./et": 284,
	"./et.js": 284,
	"./eu": 285,
	"./eu.js": 285,
	"./fa": 286,
	"./fa.js": 286,
	"./fi": 287,
	"./fi.js": 287,
	"./fo": 288,
	"./fo.js": 288,
	"./fr": 289,
	"./fr-ca": 290,
	"./fr-ca.js": 290,
	"./fr-ch": 291,
	"./fr-ch.js": 291,
	"./fr.js": 289,
	"./fy": 292,
	"./fy.js": 292,
	"./gd": 293,
	"./gd.js": 293,
	"./gl": 294,
	"./gl.js": 294,
	"./gom-latn": 295,
	"./gom-latn.js": 295,
	"./gu": 296,
	"./gu.js": 296,
	"./he": 297,
	"./he.js": 297,
	"./hi": 298,
	"./hi.js": 298,
	"./hr": 299,
	"./hr.js": 299,
	"./hu": 300,
	"./hu.js": 300,
	"./hy-am": 301,
	"./hy-am.js": 301,
	"./id": 302,
	"./id.js": 302,
	"./is": 303,
	"./is.js": 303,
	"./it": 304,
	"./it.js": 304,
	"./ja": 305,
	"./ja.js": 305,
	"./jv": 306,
	"./jv.js": 306,
	"./ka": 307,
	"./ka.js": 307,
	"./kk": 308,
	"./kk.js": 308,
	"./km": 309,
	"./km.js": 309,
	"./kn": 310,
	"./kn.js": 310,
	"./ko": 311,
	"./ko.js": 311,
	"./ky": 312,
	"./ky.js": 312,
	"./lb": 313,
	"./lb.js": 313,
	"./lo": 314,
	"./lo.js": 314,
	"./lt": 315,
	"./lt.js": 315,
	"./lv": 316,
	"./lv.js": 316,
	"./me": 317,
	"./me.js": 317,
	"./mi": 318,
	"./mi.js": 318,
	"./mk": 319,
	"./mk.js": 319,
	"./ml": 320,
	"./ml.js": 320,
	"./mn": 321,
	"./mn.js": 321,
	"./mr": 322,
	"./mr.js": 322,
	"./ms": 323,
	"./ms-my": 324,
	"./ms-my.js": 324,
	"./ms.js": 323,
	"./mt": 325,
	"./mt.js": 325,
	"./my": 326,
	"./my.js": 326,
	"./nb": 327,
	"./nb.js": 327,
	"./ne": 328,
	"./ne.js": 328,
	"./nl": 329,
	"./nl-be": 330,
	"./nl-be.js": 330,
	"./nl.js": 329,
	"./nn": 331,
	"./nn.js": 331,
	"./pa-in": 332,
	"./pa-in.js": 332,
	"./pl": 333,
	"./pl.js": 333,
	"./pt": 334,
	"./pt-br": 335,
	"./pt-br.js": 335,
	"./pt.js": 334,
	"./ro": 336,
	"./ro.js": 336,
	"./ru": 337,
	"./ru.js": 337,
	"./sd": 338,
	"./sd.js": 338,
	"./se": 339,
	"./se.js": 339,
	"./si": 340,
	"./si.js": 340,
	"./sk": 341,
	"./sk.js": 341,
	"./sl": 342,
	"./sl.js": 342,
	"./sq": 343,
	"./sq.js": 343,
	"./sr": 344,
	"./sr-cyrl": 345,
	"./sr-cyrl.js": 345,
	"./sr.js": 344,
	"./ss": 346,
	"./ss.js": 346,
	"./sv": 347,
	"./sv.js": 347,
	"./sw": 348,
	"./sw.js": 348,
	"./ta": 349,
	"./ta.js": 349,
	"./te": 350,
	"./te.js": 350,
	"./tet": 351,
	"./tet.js": 351,
	"./tg": 352,
	"./tg.js": 352,
	"./th": 353,
	"./th.js": 353,
	"./tl-ph": 354,
	"./tl-ph.js": 354,
	"./tlh": 355,
	"./tlh.js": 355,
	"./tr": 356,
	"./tr.js": 356,
	"./tzl": 357,
	"./tzl.js": 357,
	"./tzm": 358,
	"./tzm-latn": 359,
	"./tzm-latn.js": 359,
	"./tzm.js": 358,
	"./ug-cn": 360,
	"./ug-cn.js": 360,
	"./uk": 361,
	"./uk.js": 361,
	"./ur": 362,
	"./ur.js": 362,
	"./uz": 363,
	"./uz-latn": 364,
	"./uz-latn.js": 364,
	"./uz.js": 363,
	"./vi": 365,
	"./vi.js": 365,
	"./x-pseudo": 366,
	"./x-pseudo.js": 366,
	"./yo": 367,
	"./yo.js": 367,
	"./zh-cn": 368,
	"./zh-cn.js": 368,
	"./zh-hk": 369,
	"./zh-hk.js": 369,
	"./zh-tw": 370,
	"./zh-tw.js": 370
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 490;

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TripService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_service__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TripService = (function () {
    function TripService(db, authService) {
        this.db = db;
        this.authService = authService;
    }
    // create trip from deal object
    TripService.prototype.createFromDeal = function (deal) {
        deal.status = __WEBPACK_IMPORTED_MODULE_2__constants__["u" /* TRIP_STATUS_WAITING */];
        deal.otp = Math.floor(Math.random() * 9999);
        return this.db.list('trips').push(deal);
    };
    // pickup passenger
    TripService.prototype.pickUp = function (tripId) {
        this.db.object('trips/' + tripId).update({
            pickedUpAt: Date.now(),
            status: __WEBPACK_IMPORTED_MODULE_2__constants__["t" /* TRIP_STATUS_GOING */]
        });
    };
    // drop off
    TripService.prototype.dropOff = function (tripId) {
        this.db.object('trips/' + tripId).update({
            droppedOffAt: Date.now(),
            status: __WEBPACK_IMPORTED_MODULE_2__constants__["s" /* TRIP_STATUS_FINISHED */]
        });
    };
    TripService.prototype.cancel = function (tripId) {
        this.db.object('trips/' + tripId).update({
            droppedOffAt: Date.now(),
            status: __WEBPACK_IMPORTED_MODULE_2__constants__["r" /* TRIP_STATUS_CANCELED */]
        });
    };
    TripService.prototype.setCurrentTrip = function (tripId) {
        var _this = this;
        return this.db.object('trips/' + tripId).take(1).subscribe(function (snapshot) {
            _this.currentTrip = snapshot;
        });
    };
    TripService.prototype.getCurrentTrip = function () {
        console.log(this.currentTrip);
        return this.currentTrip;
    };
    TripService.prototype.getTripStatus = function (tripId) {
        return this.db.object('trips/' + tripId);
    };
    TripService.prototype.getPassenger = function (passengerId) {
        return this.db.object('passengers/' + passengerId);
    };
    // get driver's trip
    TripService.prototype.getTrips = function () {
        var user = this.authService.getUserData();
        return this.db.list('trips', {
            query: {
                orderByChild: 'driverId',
                equalTo: user.uid,
            }
        });
    };
    TripService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */]])
    ], TripService);
    return TripService;
}());

//# sourceMappingURL=trip-service.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlaceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PlaceService = (function () {
    function PlaceService(http, storage) {
        this.http = http;
        this.storage = storage;
    }
    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    PlaceService.prototype.calcCrow = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };
    // Converts numeric degrees to radians
    PlaceService.prototype.toRad = function (value) {
        return value * Math.PI / 180;
    };
    // set locality from geocoder result
    // @param results: Geocoder array results
    PlaceService.prototype.setLocalityFromGeocoder = function (results) {
        var component;
        var address;
        for (var i = 0; i < results.length; i++) {
            address = results[i];
            for (var j = 0; j < address.address_components.length; j++) {
                component = address.address_components[j];
                if (component.types[0] == 'locality') {
                    // if (component.types[0] == 'administrative_area_level_2') {
                    // escape firebase characters
                    var locality = component.short_name.replace(/[\%\.\#\$\/\[\]]/, '_');
                    this.setLocality(locality);
                    return locality;
                }
            }
        }
        return false;
    };
    PlaceService.prototype.setLocality = function (locality) {
        return this.locality = locality;
    };
    PlaceService.prototype.getLocality = function () {
        return this.locality;
    };
    PlaceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], PlaceService);
    return PlaceService;
}());

//# sourceMappingURL=place-service.js.map

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DriverService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DriverService = (function () {
    function DriverService(db, authService) {
        this.db = db;
        this.authService = authService;
        this.user = this.authService.getUserData();
    }
    DriverService.prototype.setUser = function (user) {
        this.user = user;
    };
    // get driver by id
    DriverService.prototype.getDriver = function () {
        var user = this.authService.getUserData();
        return this.db.object('drivers/' + user.uid);
    };
    // update driver's position
    DriverService.prototype.updatePosition = function (vehicleId, vehicleType, locality, lat, lng, rating, name) {
        var _this = this;
        var path = 'localities/' + locality + '/' + vehicleType + '/' + vehicleId;
        console.log('tracking', lat, lng);
        this.db.object(path).take(1).subscribe(function (snapshot) {
            console.log(snapshot);
            // insert if not exists
            if (snapshot.$value === null) {
                _this.db.object(path).set({
                    lat: lat,
                    lng: lng,
                    oldLat: lat,
                    oldLng: lng,
                    last_active: Date.now(),
                    rating: rating,
                    name: name
                });
            }
            else {
                // update
                _this.db.object(path).update({
                    lat: lat,
                    lng: lng,
                    oldLat: snapshot.lat,
                    oldLng: snapshot.lng,
                    last_active: Date.now(),
                    rating: rating,
                    name: name
                });
            }
        });
    };
    DriverService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]])
    ], DriverService);
    return DriverService;
}());

//# sourceMappingURL=driver-service.js.map

/***/ }),

/***/ 71:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__register_register__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_service__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_constants__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginPage = (function () {
    function LoginPage(nav, authService, alertCtrl, loadingCtrl, toast, translate) {
        this.nav = nav;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.translate = translate;
        this.userInfo = {};
        this.isRegisterEnabled = __WEBPACK_IMPORTED_MODULE_5__services_constants__["n" /* ENABLE_SIGNUP */];
    }
    // go to signup page
    LoginPage.prototype.signup = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_2__register_register__["a" /* RegisterPage */]);
    };
    // go to login page
    LoginPage.prototype.login = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: 'Please wait...' });
        loading.present();
        this.authService.login(this.userInfo.email, this.userInfo.password).then(function (authData) {
            loading.dismiss();
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
        }, function (error) {
            loading.dismiss();
            var alert = _this.alertCtrl.create({
                message: error.message,
                buttons: ['OK']
            });
            alert.present();
        });
    };
    LoginPage.prototype.reset = function () {
        var _this = this;
        if (this.userInfo.email) {
            __WEBPACK_IMPORTED_MODULE_6_firebase__["auth"]().sendPasswordResetEmail(this.userInfo.email)
                .then(function (data) {
                return _this.toast.create({ message: 'Please check your mail', duration: 3000 }).present();
            })
                .catch(function (err) { return _this.toast.create({ message: err.message, duration: 3000 }).present(); });
        }
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/login/login.html"*/'<ion-content>\n  <div padding text-center class="header">\n    <div class="logo secondary-bg">\n      <!-- <img src="assets/img/login.png" /> -->\n      <ion-icon name="ios-car" color="light"></ion-icon>\n    </div>\n    <h2 ion-text color="light">{{\'LOGIN\' | translate}}</h2>\n  </div>\n  <ion-list class="list-form" padding>\n    <ion-item>\n      <ion-label stacked>{{\'EMAIL_ADDRESS\'| translate}}</ion-label>\n      <ion-input type="text" [(ngModel)]="userInfo.email"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>{{\'PASSWORD\'| translate}}</ion-label>\n      <ion-input type="password" [(ngModel)]="userInfo.password"></ion-input>\n      <button ion-button clear item-right (click)="reset()">{{\'FORGOT\' | translate}}</button>\n    </ion-item>\n    <ion-item>\n      <button padding ion-button block (click)="login()">{{\'LOGIN\' | translate}}</button>\n    </ion-item>\n  </ion-list>\n</ion-content>\n<ion-footer *ngIf="isRegisterEnabled">\n  <button ion-button clear block (click)="signup()">{{\'REGISTER\' | translate}}</button>\n</ion-footer>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/driver/src/pages/login/login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ })

},[382]);
//# sourceMappingURL=main.js.map