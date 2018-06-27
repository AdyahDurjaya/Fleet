import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassengerinfoPage } from './passengerinfo';

@NgModule({
  declarations: [
    PassengerinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PassengerinfoPage),
  ],
})
export class PassengerinfoPageModule {}
