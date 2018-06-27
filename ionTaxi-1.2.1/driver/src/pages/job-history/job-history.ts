import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportService } from '../../services/report-service';
import { TripService } from "../../services/trip-service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-job-history',
  templateUrl: 'job-history.html'
})
export class JobHistoryPage {

  // statistic
  public stats: any = {
    today: 0,
    yesterday: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    lastYear: 0
  };

  // list of records
  public trips: any;

  constructor(public nav: NavController, public tripService: TripService, public reportService: ReportService, public translate: TranslateService) {
    reportService.getAll().take(1).subscribe(snapshot => {
      console.log(snapshot);
      let today = new Date();
      let lastYear = today.getFullYear() - 1;
      let lastMonth = (today.getMonth() > 0) ? today.getMonth() : 12;
      let yesterday = new Date(Date.now() - 86400000);
      let thisYear = today.getFullYear();
      let thisMonth = today.getMonth() + 1;

      // get current
      if (snapshot[thisYear]) {
        this.stats.thisYear = snapshot[thisYear].total;

        if (snapshot[thisYear][thisMonth]) {
          this.stats.thisMonth = snapshot[thisYear][thisMonth].total;

          if (snapshot[thisYear][thisMonth][today.getDate()]) {
            this.stats.today = snapshot[thisYear][thisMonth][today.getDate()].total;
          }
        }

        if ((lastMonth != 12) && snapshot[thisYear][lastMonth]) {
          this.stats.lastMonth = snapshot[thisYear][lastMonth].total;
        }
      }

      // get last year & last month data
      if (snapshot[lastYear]) {
        this.stats.lastYear = snapshot[lastYear].total;

        if ((lastMonth == 12) && snapshot[lastYear][lastMonth]) {
          this.stats.lastMonth = snapshot[lastYear][lastMonth].total;
        }
      }

      // get yesterday's data
      if (snapshot[yesterday.getFullYear()]
          && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1]
          && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()]) {
        this.stats.yesterday = snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()].total;
      }
    });

    this.tripService.getTrips().take(1).subscribe(snapshot => {
      this.trips = snapshot.reverse();
    });
  }

}
