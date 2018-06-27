import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriversPage } from './drivers';

@NgModule({
  declarations: [
    DriversPage,
  ],
  imports: [
    IonicPageModule.forChild(DriversPage),
  ],
})
export class DriversPageModule {}
