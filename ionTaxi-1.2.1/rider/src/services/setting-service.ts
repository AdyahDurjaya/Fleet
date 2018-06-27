import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SettingService {

  constructor(public db: AngularFireDatabase) {}

  getPrices() {
    return this.db.object('master_settings/prices');
  }
}