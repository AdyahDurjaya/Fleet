webpackJsonp([8],{

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CarsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
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



var CarsPage = (function () {
    function CarsPage(navCtrl, navParams, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.cars = [];
        this.newCar = { icon: '' };
        this.carTemp = [];
    }
    CarsPage.prototype.ionViewDidLoad = function () {
        this.getCarInfo();
    };
    CarsPage.prototype.getCarInfo = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/').child('currency').on('value', function (currency) { _this.currency = currency.val(); });
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/vehicles/').on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (car) {
                tmp.push(__assign({ key: car.key }, car.val()));
                return false;
            });
            _this.cars = tmp;
        });
    };
    CarsPage.prototype.delete = function (key) {
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/vehicles/' + key).remove();
    };
    CarsPage.prototype.add = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/vehicles/' + this.newCar.icon).set(this.newCar).then(function (data) {
            _this.displayToast("New Car has beed added");
            _this.newCar = { icon: '' };
        });
    };
    CarsPage.prototype.update = function (i) {
        var _this = this;
        var car = this.cars[i];
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/vehicles/' + car.key).update(car).then(function (data) {
            _this.displayToast("Updated Successfully");
        }).catch(function (err) { return console.log(err); });
    };
    CarsPage.prototype.updateCurrency = function () {
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings/prices/default/').child('currency').set(this.currency);
    };
    CarsPage.prototype.displayToast = function (message) {
        this.toastCtrl.create({ message: message, duration: 2000 }).present();
    };
    CarsPage.prototype.setDefault = function () {
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('master_settings').set({
            "prices": {
                "default": {
                    "currency": "$",
                    "vehicles": {
                        "car": {
                            "enable": true,
                            "icon": "sedan",
                            "name": "Car",
                            "price": 0.2
                        },
                        "suv": {
                            "enable": true,
                            "icon": "suv",
                            "name": "SUV",
                            "price": 0.2
                        },
                        "taxi": {
                            "enable": true,
                            "icon": "taxi",
                            "name": "Taxi",
                            "price": 0.4
                        }
                    }
                }
            }
        });
    };
    CarsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cars',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/cars/cars.html"*/'<ion-header>\n\n  <ion-navbar color="dark">\n    <ion-title>Cars</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="setDefault()">Set Default</button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <p><b>!!Important!!:</b> Click "SET DEFAULT" Button, only for first time</p>\n  <h5>Update Currency Symbol</h5>\n  <ion-item>\n    <ion-label stacked>Currency Symbol</ion-label>\n    <ion-input [(ngModel)]="currency"></ion-input>\n    <button ion-button item-right (click)="updateCurrency()">Update</button>\n  </ion-item>\n  <br/>\n  <br/>\n  <h5>Add New Car Type</h5>\n  <table>\n    <thead>\n      <th>Name</th>\n      <th>Icon Path (Local / Web)</th>\n      <th>Fare / Km ({{this.currency}})</th>\n      <th>More</th>\n    </thead>\n    <tbody>\n      <tr>\n        <td>\n          <input type="text" [(ngModel)]="newCar.name" />\n        </td>\n        <td>\n          <input type="text" [(ngModel)]="newCar.icon" />\n        </td>\n        <td>\n          <input type="text" [(ngModel)]="newCar.price" />\n        </td>\n        <td>\n          <a href="#" (click)="add()">Add New Car</a>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <br/>\n  <br/>\n  <h5>All Car Types - ({{cars.length}})</h5>\n  <br/>\n  <table>\n    <thead>\n      <th>Name</th>\n      <th>Icon Path (Local / Web)</th>\n      <th>Fare / Km ({{this.currency}})</th>\n      <th>More</th>\n    </thead>\n    <tbody>\n      <tr *ngFor="let car of cars;let i = index">\n        <td>\n          <input type="text" [(ngModel)]="cars[i].name" />\n        </td>\n        <td>\n          <input type="text" [(ngModel)]="cars[i].icon" />\n        </td>\n        <td>\n          <input type="text" [(ngModel)]="cars[i].price" />\n        </td>\n        <td>\n          <a href="#" (click)="update(i)">Save</a> -\n          <a href="#" (click)="delete(car.key)">Delete</a>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</ion-content>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/cars/cars.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], CarsPage);
    return CarsPage;
}());

//# sourceMappingURL=cars.js.map

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DriversPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__driverinfo_driverinfo__ = __webpack_require__(80);
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




var DriversPage = (function () {
    function DriversPage(navCtrl, navParams, loadCtrl, modalCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadCtrl = loadCtrl;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.drivers = [];
    }
    DriversPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DriversPage');
        this.getDrivers();
    };
    DriversPage.prototype.getDrivers = function () {
        var _this = this;
        var loader = this.loadCtrl.create({ content: 'Loading..' });
        loader.present();
        console.log("calling");
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('drivers').on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (snap) {
                var data = __assign({ key: snap.key }, snap.val());
                tmp.push(data);
                return false;
            });
            _this.drivers = tmp;
            console.log(_this.drivers);
            loader.dismiss();
        });
    };
    DriversPage.prototype.goDriverInfo = function (driver) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__driverinfo_driverinfo__["a" /* DriverinfoPage */], driver);
    };
    DriversPage.prototype.openInfo = function (key) {
        console.log(key);
        this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__driverinfo_driverinfo__["a" /* DriverinfoPage */], { key: key }).present();
    };
    DriversPage.prototype.delete = function (key) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('drivers/' + key).remove().then(function (data) {
            _this.displayToast("Deleted Successfully");
        });
    };
    DriversPage.prototype.displayToast = function (msg) {
        this.toastCtrl.create({ message: msg, duration: 2000 }).present();
    };
    DriversPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-drivers',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/drivers/drivers.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <ion-title>Drivers ({{drivers.length}})</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <table>\n    <thead>\n      <th>Name</th>\n      <th>Email</th>\n      <th>Mobile</th>\n      <th>More</th>\n    </thead>\n    <tbody>\n      <tr *ngFor="let driver of drivers">\n        <td><img [src]="driver.photoURL" class="dp"> <a href="#" (click)="openInfo(driver.key)">{{driver.name}}</a></td>\n        <td>{{driver.email}}</td>\n        <td><a item-right href="tel:{{driver.phoneNumber}}" *ngIf="driver.phoneNumber">{{driver.phoneNumber}}</a></td>\n        <td><a href="#" (click)="delete(driver.key)">Delete</a></td>\n      </tr>\n    </tbody>\n  </table>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/drivers/drivers.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], DriversPage);
    return DriversPage;
}());

//# sourceMappingURL=drivers.js.map

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
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
    function LoginPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.user = {};
        this.adminEmail = 'anshulgelani@gmail.com';
    }
    LoginPage.prototype.login = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["auth"]().signInWithEmailAndPassword(this.user.email, this.user.password).then(function (data) {
            console.log(data);
            if (__WEBPACK_IMPORTED_MODULE_2_firebase__["auth"]().currentUser.email == _this.adminEmail) {
                _this.viewCtrl.dismiss();
            }
        }).catch(function (err) { return console.log(err); });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/login/login.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>Login</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-list>\n    <ion-item>\n      <ion-label stacked>Email</ion-label>\n      <ion-input type="text" [(ngModel)]="user.email"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>Password</ion-label>\n      <ion-input type="text" [(ngModel)]="user.password"></ion-input>\n    </ion-item>\n    <ion-item>\n      <button ion-button block (click)="login()">Login</button>\n    </ion-item>\n  </ion-list>\n</ion-content>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PassengersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__passengerinfo_passengerinfo__ = __webpack_require__(81);
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




var PassengersPage = (function () {
    function PassengersPage(navCtrl, navParams, loadCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadCtrl = loadCtrl;
        this.modalCtrl = modalCtrl;
        this.passengers = [];
    }
    PassengersPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CustomersPage');
        this.getPassengers();
    };
    PassengersPage.prototype.getPassengers = function () {
        var _this = this;
        var loader = this.loadCtrl.create({ content: 'Loading..' });
        loader.present();
        console.log("calling");
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('passengers').on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (snap) {
                var data = __assign({ key: snap.key }, snap.val());
                tmp.push(data);
                return false;
            });
            _this.passengers = tmp;
            loader.dismiss();
        });
    };
    PassengersPage.prototype.showPassengerInfo = function (key) {
        this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__passengerinfo_passengerinfo__["a" /* PassengerinfoPage */], { key: key }).present();
    };
    PassengersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-passengers',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/passengers/passengers.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <ion-title>All Passengers - {{passengers.length}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <table>\n      <thead>\n        <th>Name</th>\n        <th>Email</th>\n        <th>Mobile</th>\n        <th>More</th>\n      </thead>\n      <tbody>\n        <tr *ngFor="let passenger of passengers">\n          <td><img [src]="passenger.photoURL" class="dp"> <a href="#" (click)="showPassengerInfo(passenger.key)">{{passenger.name}}</a></td>\n          <td>{{passenger.email}}</td>\n          <td><a item-right href="tel:{{passenger.phoneNumber}}" *ngIf="passenger.phoneNumber">{{passenger.phoneNumber}}</a></td>\n          <td><a href="#">Delete</a></td>\n        </tr>\n      </tbody>\n    </table>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/passengers/passengers.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */]])
    ], PassengersPage);
    return PassengersPage;
}());

//# sourceMappingURL=passengers.js.map

/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PromosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
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



var PromosPage = (function () {
    function PromosPage(navCtrl, navParams, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.promocodes = [];
        this.newpromocode = {};
    }
    PromosPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PromosPage');
        this.getPromos();
    };
    PromosPage.prototype.getPromos = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('promocodes').on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (promo) {
                tmp.push(__assign({ key: promo.key }, promo.val()));
                return false;
            });
            _this.promocodes = tmp;
        });
    };
    PromosPage.prototype.delete = function (key) {
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('promocodes/' + key).remove();
    };
    PromosPage.prototype.add = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('promocodes').push(this.newpromocode).then(function (data) {
            _this.displayToast("New Promo code added");
        });
    };
    PromosPage.prototype.update = function (i) {
        var _this = this;
        var promocode = this.promocodes[i];
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('promocodes/' + promocode.key).update(promocode).then(function (data) {
            _this.displayToast("Updated Successfully");
        }).catch(function (err) { return console.log(err); });
    };
    PromosPage.prototype.displayToast = function (message) {
        this.toastCtrl.create({ message: message, duration: 2000 }).present();
    };
    PromosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-promos',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/promos/promos.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>Manage Promo Codes</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n    <table>\n      <thead>\n        <th>Title</th>\n        <th>Code</th>\n        <th>Percentage</th>\n        <th>More</th>\n      </thead>\n      <tbody>\n        <tr>\n          <td><input type="text" [(ngModel)]="newpromocode.title"/></td>\n          <td><input type="text" [(ngModel)]="newpromocode.code"/></td>\n          <td><input type="text" [(ngModel)]="newpromocode.discount"/></td>\n          <td><a href="#" (click)="add()">Add Promo</a></td>\n        </tr>\n      </tbody>\n    </table>\n    <h4 style="text-align:center">All Promo codes</h4>\n    <br/>\n    <table>\n      <thead>\n        <th>Title</th>\n        <th>Code</th>\n        <th>Percentage</th>\n        <th>More</th>\n      </thead>\n      <tbody>\n        <tr *ngFor="let code of promocodes;let i = index">\n          <td><input type="text" [(ngModel)]="promocodes[i].title"/></td>\n          <td><input type="text" [(ngModel)]="promocodes[i].code"/></td>\n          <td><input type="text" [(ngModel)]="promocodes[i].discount"/></td>\n          <td><a href="#" (click)="update(i)">Save</a> - <a href="#" (click)="delete(code.key)">Delete</a></td>\n        </tr>\n      </tbody>\n    </table>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/promos/promos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], PromosPage);
    return PromosPage;
}());

//# sourceMappingURL=promos.js.map

/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TripsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__driverinfo_driverinfo__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__passengerinfo_passengerinfo__ = __webpack_require__(81);
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





var TripsPage = (function () {
    function TripsPage(navCtrl, navParams, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.trips = [];
    }
    TripsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TripsPage');
        this.getAllTrips();
    };
    TripsPage.prototype.getAllTrips = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('trips').on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (snap) {
                tmp.push(__assign({ key: snap.key }, snap.val()));
                return false;
            });
            _this.trips = tmp;
        });
    };
    TripsPage.prototype.showDriver = function (key) {
        this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__driverinfo_driverinfo__["a" /* DriverinfoPage */], { key: key }).present();
    };
    TripsPage.prototype.showPassenger = function (key) {
        this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__passengerinfo_passengerinfo__["a" /* PassengerinfoPage */], { key: key }).present();
    };
    TripsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-trips',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/trips/trips.html"*/'<ion-header>\n\n  <ion-navbar color="dark">\n    <ion-title>Trips</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <table>\n      <thead>\n        <th>From & To</th>\n        <th>Driver & Passenger</th>\n        <th>Fee & Rating</th>\n        <th>Status</th>\n      </thead>\n      <tbody>\n        <tr *ngFor="let trip of trips">\n          <td>\n            <b>From:</b> ({{trip.pickedUpAt}})<br/>\n            {{trip.origin.vicinity}} <br/><br/>\n            <b>To:</b> ({{trip.droppedOffAt}})<br/>\n            {{trip.destination.vicinity}}\n          </td>\n          <td>\n            Trip Id: {{trip.key}} <br/>\n            Driver:<br/> <a href="#" (click)="showDriver(trip.driverId)">{{trip.driverId}}</a> <br/>\n            Passenger:<br/> <a href="#" (click)="showPassenger(trip.passengerId)">{{trip.passengerId}}</a></td>\n          <td>\n            Fee: {{trip.currency}} {{trip.fee}} <br/>\n            Discount ({{trip.promo}}): {{trip.discount}} % <br/>\n            Final: {{ trip.fee - (trip.fee * trip.discount / 100) }}<br/>\n            Rating: {{trip.rating}} / 5\n          </td>\n          <td>{{trip.status}}</td>\n        </tr>\n      </tbody>\n    </table>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/trips/trips.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */]])
    ], TripsPage);
    return TripsPage;
}());

//# sourceMappingURL=trips.js.map

/***/ }),

/***/ 158:
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
webpackEmptyAsyncContext.id = 158;

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/cars/cars.module": [
		444,
		7
	],
	"../pages/driverinfo/driverinfo.module": [
		445,
		6
	],
	"../pages/drivers/drivers.module": [
		446,
		5
	],
	"../pages/login/login.module": [
		447,
		4
	],
	"../pages/passengerinfo/passengerinfo.module": [
		448,
		3
	],
	"../pages/passengers/passengers.module": [
		449,
		2
	],
	"../pages/promos/promos.module": [
		450,
		1
	],
	"../pages/trips/trips.module": [
		451,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 199;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
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
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h3>Simple Admin Panel of ionTaxi</h3>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(308);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_drivers_drivers__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_driverinfo_driverinfo__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_trips_trips__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_cars_cars__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_passengers_passengers__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_passengerinfo_passengerinfo__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_promos_promos__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_login_login__ = __webpack_require__(146);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_drivers_drivers__["a" /* DriversPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_driverinfo_driverinfo__["a" /* DriverinfoPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_passengerinfo_passengerinfo__["a" /* PassengerinfoPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_trips_trips__["a" /* TripsPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_cars_cars__["a" /* CarsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_passengers_passengers__["a" /* PassengersPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_promos_promos__["a" /* PromosPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/cars/cars.module#CarsPageModule', name: 'CarsPage', segment: 'cars', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/driverinfo/driverinfo.module#DriverinfoPageModule', name: 'DriverinfoPage', segment: 'driverinfo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/drivers/drivers.module#DriversPageModule', name: 'DriversPage', segment: 'drivers', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/passengerinfo/passengerinfo.module#PassengerinfoPageModule', name: 'PassengerinfoPage', segment: 'passengerinfo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/passengers/passengers.module#PassendgersPageModule', name: 'PassengersPage', segment: 'passengers', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/promos/promos.module#PromosPageModule', name: 'PromosPage', segment: 'promos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/trips/trips.module#TripsPageModule', name: 'TripsPage', segment: 'trips', priority: 'low', defaultHistory: [] }
                    ]
                }),
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_drivers_drivers__["a" /* DriversPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_driverinfo_driverinfo__["a" /* DriverinfoPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_trips_trips__["a" /* TripsPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_cars_cars__["a" /* CarsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_passengers_passengers__["a" /* PassengersPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_passengerinfo_passengerinfo__["a" /* PassengerinfoPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_promos_promos__["a" /* PromosPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 435:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_drivers_drivers__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_trips_trips__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_cars_cars__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_passengers_passengers__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_promos_promos__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_login_login__ = __webpack_require__(146);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, modalCtrl) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.modalCtrl = modalCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */] },
            { title: 'Drivers', component: __WEBPACK_IMPORTED_MODULE_5__pages_drivers_drivers__["a" /* DriversPage */] },
            { title: 'Passengers', component: __WEBPACK_IMPORTED_MODULE_9__pages_passengers_passengers__["a" /* PassengersPage */] },
            { title: 'Trips', component: __WEBPACK_IMPORTED_MODULE_7__pages_trips_trips__["a" /* TripsPage */] },
            { title: 'Promo Codes', component: __WEBPACK_IMPORTED_MODULE_10__pages_promos_promos__["a" /* PromosPage */] },
            { title: 'Settings', component: __WEBPACK_IMPORTED_MODULE_8__pages_cars_cars__["a" /* CarsPage */] }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_6_firebase__["initializeApp"]({
            apiKey: "AIzaSyA53cAEXLay6O1rPP7uG4myD3vMHGdvL4U",
            authDomain: "fleet-23516.firebaseapp.com",
            databaseURL: "https://fleet-23516.firebaseio.com",
            projectId: "fleet-23516",
            storageBucket: "fleet-23516.appspot.com",
            messagingSenderId: "420455656383"
        });
        if (!__WEBPACK_IMPORTED_MODULE_6_firebase__["auth"]().currentUser) {
            this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* LoginPage */], {}, { enableBackdropDismiss: false }).present();
        }
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/app/app.html"*/'<ion-split-pane>\n<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar color="dark">\n      <ion-title>Admin Panel</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n<ion-nav [root]="rootPage" main #content></ion-nav>\n</ion-split-pane>'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DriverinfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
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



var DriverinfoPage = (function () {
    function DriverinfoPage(navCtrl, navParams, loadCtrl, viewCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadCtrl = loadCtrl;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.driver = {};
        this.tabs = 'carinfo';
        this.trips = [];
        this.driverKey = navParams.get('key');
    }
    DriverinfoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DriverinfoPage');
        this.getDriverInfo();
    };
    DriverinfoPage.prototype.getDriverInfo = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('drivers/' + this.driverKey).on('value', function (snapshot) {
            _this.driver = snapshot.val();
            console.log(_this.driver);
        });
    };
    DriverinfoPage.prototype.getTrips = function () {
        var _this = this;
        var loading = this.loadCtrl.create({ content: 'Please wait...' });
        loading.present();
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('trips').orderByChild('driverId').equalTo(this.driverKey).on('value', function (snapshot) {
            console.log(snapshot);
            var tmp = [];
            snapshot.forEach(function (snap) {
                tmp.push(__assign({ key: snap.key }, snap.val()));
                return false;
            });
            _this.trips = tmp;
            loading.dismiss();
        });
    };
    DriverinfoPage.prototype.updateDriver = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('drivers/' + this.driverKey).update(this.driver).then(function (data) {
            _this.displayToast("Updated Successfully");
        });
    };
    DriverinfoPage.prototype.displayToast = function (message) {
        this.toastCtrl.create({ message: message, duration: 2000 }).present();
    };
    DriverinfoPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    DriverinfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-driverinfo',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/driverinfo/driverinfo.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <ion-title>{{driver.name}}</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="close()">Close</button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n  <ion-item>\n    <ion-avatar item-left>\n      <img src="{{driver.photoURL}}"/>\n    </ion-avatar>\n    <h3>{{driver.name}}</h3>\n    <p>{{driver.email}}</p>\n    <a ion-button item-right href="tel:{{driver.phoneNumber}}">Call: {{driver.phoneNumber}}</a>\n  </ion-item>\n  <ion-segment [(ngModel)]="tabs">\n    <ion-segment-button value="carinfo">\n      CAR INFORMATION\n    </ion-segment-button>\n    <ion-segment-button value="ridehistroy" (click)="getTrips()">\n      Ride History\n    </ion-segment-button>\n  </ion-segment>\n  <div [ngSwitch]="tabs">\n      <div *ngSwitchCase="\'carinfo\'">\n          <ion-item>\n            <ion-label stacked>CAR TYPE</ion-label>\n            <ion-input type="text" [(ngModel)]="driver.type" disabled></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label stacked>PLATE NUMBER</ion-label>\n            <ion-input type="text" [(ngModel)]="driver.plate"></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label stacked>CAR BRAND</ion-label>\n            <ion-input type="text" [(ngModel)]="driver.brand"></ion-input>\n            <a *ngIf="driver.carImg != null" href="{{driver.carImg}}" target="_blank" ion-button item-right clear>View Image</a>\n          </ion-item>\n          <ion-item *ngIf="driver.docsURL">\n            <ion-label>Documents</ion-label>\n            <a href="{{driver.docsURL}}" target="_blank" ion-button item-right>View / Download</a>\n          </ion-item>\n          <ion-item>\n              <button ion-button block (click)="updateDriver()">Update</button>\n          </ion-item>\n      </div>\n      <div *ngSwitchCase="\'ridehistroy\'">\n        <ion-card *ngFor="let trip of trips">\n            <ion-card-content>\n              <p>{{trip.$key}}</p>\n              <ion-row>\n                <ion-col>\n                  <b style="text-align:center">FROM</b> \n                  <p>{{ trip.origin.vicinity }} <br/> <ion-note>{{ trip.pickedUpAt}}</ion-note></p>\n                </ion-col>\n                <ion-col>\n                    <b style="text-align:center">TO</b> \n                    <p>{{ trip.destination.vicinity }} <br/> <ion-note>{{ trip.droppedOffAt}}</ion-note></p>\n                </ion-col>\n              </ion-row>\n              <p>Payment Mode: {{ trip.paymentMethod }}</p>\n              <p>Fee: {{trip.currency}} {{trip.fee}} * {{ trip.promo}} {{trip.discount}} % = {{ trip.fee - (trip.fee * trip.discount / 100) }}</p>\n            </ion-card-content>\n          </ion-card>\n      </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/driverinfo/driverinfo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], DriverinfoPage);
    return DriverinfoPage;
}());

//# sourceMappingURL=driverinfo.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PassengerinfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
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



var PassengerinfoPage = (function () {
    function PassengerinfoPage(navCtrl, navParams, viewCtrl, loadCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loadCtrl = loadCtrl;
        this.toastCtrl = toastCtrl;
        this.passenger = {};
        this.trips = [];
        this.tabs = 'basicinfo';
        this.passengerKey = navParams.get('key');
    }
    PassengerinfoPage.prototype.ionViewDidLoad = function () {
        this.getPassengersInfo();
    };
    PassengerinfoPage.prototype.getPassengersInfo = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('passengers/' + this.passengerKey).on('value', function (snapshot) {
            _this.passenger = snapshot.val();
        });
    };
    PassengerinfoPage.prototype.getTrips = function () {
        var _this = this;
        var loading = this.loadCtrl.create({ content: 'Please wait...' });
        loading.present();
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('trips').orderByChild('passengerId').equalTo(this.passengerKey).on('value', function (snapshot) {
            var tmp = [];
            snapshot.forEach(function (snap) {
                tmp.push(__assign({ key: snap.key }, snap.val()));
                return false;
            });
            _this.trips = tmp;
            loading.dismiss();
        });
    };
    PassengerinfoPage.prototype.updateUserInfo = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref('passengers/' + this.passengerKey).update(this.passenger).then(function (data) {
            _this.displayToast("Updated Successfully");
        }).catch(function (err) { return console.log(err); });
    };
    PassengerinfoPage.prototype.displayToast = function (message) {
        this.toastCtrl.create({ message: message, duration: 2000 }).present();
    };
    PassengerinfoPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    PassengerinfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-passengerinfo',template:/*ion-inline-start:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/passengerinfo/passengerinfo.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <ion-title>{{passenger.name}}</ion-title>\n    <ion-buttons end>\n      <button ion-button clear (click)="close()">Close</button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-segment [(ngModel)]="tabs">\n      <ion-segment-button value="basicinfo">\n        BASIC INFORMATION\n      </ion-segment-button>\n      <ion-segment-button value="ridehistroy" (click)="getTrips()">\n        Ride History\n      </ion-segment-button>\n    </ion-segment>\n    <div [ngSwitch]="tabs">\n        <div *ngSwitchCase="\'basicinfo\'">\n          <ion-item>\n            <ion-avatar item-left>\n              <img src="{{passenger.photoURL}}"/>\n            </ion-avatar>\n            <ion-label stacked>Name</ion-label>\n            <ion-input type="text" [(ngModel)]="passenger.name"></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label stacked>Email</ion-label>\n            <ion-input type="text" [(ngModel)]="passenger.email"></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label stacked>Phone Number</ion-label>\n            <ion-input type="text" [(ngModel)]="passenger.phoneNumber"></ion-input>\n            <a ion-button item-right *ngIf="passenger.phoneNumber" href="tel:{{passenger.phoneNumber}}">Call</a>\n          </ion-item>\n          <ion-item>\n            <button ion-button block (click)="updateUserInfo()">Update</button>\n          </ion-item>\n        </div>\n        <div *ngSwitchCase="\'ridehistroy\'">\n          <ion-card *ngFor="let trip of trips">\n              <ion-card-content>\n                <p>{{trip.$key}}</p>\n                <ion-row>\n                  <ion-col>\n                    <b style="text-align:center">FROM</b> \n                    <p>{{ trip.origin.vicinity }} <br/> <ion-note>{{ trip.pickedUpAt}}</ion-note></p>\n                  </ion-col>\n                  <ion-col>\n                      <b style="text-align:center">TO</b> \n                      <p>{{ trip.destination.vicinity }} <br/> <ion-note>{{ trip.droppedOffAt}}</ion-note></p>\n                  </ion-col>\n                </ion-row>\n                <p>Payment Mode: {{ trip.paymentMethod }}</p>\n                <p>Fee: {{trip.currency}} {{trip.fee}} * {{ trip.promo}} {{trip.discount}} % = {{ trip.fee - (trip.fee * trip.discount / 100) }}</p>\n              </ion-card-content>\n            </ion-card>\n        </div>\n      </div>\n</ion-content>\n'/*ion-inline-end:"/home/desa/ionTaxi-1.2.1/ionTaxi-1.2.1/admin/src/pages/passengerinfo/passengerinfo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], PassengerinfoPage);
    return PassengerinfoPage;
}());

//# sourceMappingURL=passengerinfo.js.map

/***/ })

},[285]);
//# sourceMappingURL=main.js.map