import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverinfoPage } from './driverinfo';

@NgModule({
  declarations: [
    DriverinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverinfoPage),
  ],
})
export class DriverinfoPageModule {}
