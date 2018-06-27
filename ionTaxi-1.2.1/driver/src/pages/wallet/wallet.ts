import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { TransactionService } from '../../services/transaction-service';
import { DriverService } from "../../services/driver-service";
import { CURRENCY_SYMBOL } from '../../services/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {
  // list of transactions
  public records: any;
  public driver: any;
  currency: any = CURRENCY_SYMBOL;

  constructor(public nav: NavController, public transactionService: TransactionService, public translate: TranslateService,
    public driverService: DriverService, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    // get transactions from service
    transactionService.getTransactions().subscribe(snapshot => {
      this.records = snapshot.reverse();
    });
    driverService.getDriver().subscribe(snapshot => {
      this.driver = snapshot;
    });

  }

  withdraw() {

    let prompt = this.alertCtrl.create({
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
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {

            if (data.amount > this.driver.balance) {
              let alert = this.alertCtrl.create({
                title: 'Error',
                message: 'Your balance is not enough',
                buttons: ['OK']
              });
              return alert.present();
            }

            this.transactionService.widthDraw(data.amount, this.driver.balance).then(() => {
              let toast = this.toastCtrl.create({
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
  }
}