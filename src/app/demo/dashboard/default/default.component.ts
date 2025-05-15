// Angular Import
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// project import
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { UserHistoryService } from 'src/app/services/user-history-service/user-history.service';
import { BajajChartComponent } from 'src/app/theme/shared/components/apexchart/bajaj-chart/bajaj-chart.component';
import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';
import { ChartDataMonthComponent } from 'src/app/theme/shared/components/apexchart/chart-data-month/chart-data-month.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-default',
  imports: [CommonModule, BajajChartComponent, BarChartComponent, ChartDataMonthComponent, SharedModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  topUsersList = [];
  earnedList = [];
  redeemedList = [];
  monthsList = [];
  totalEarned: number;
  totalRedeemed: number;
  total_earning: number;
  total_redemption: number;
  datesError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private navRoute: Router,
    private analyticsSvc: UserHistoryService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {}

  SearchDashboardForm = this.fb.group({
    start_date: [''],
    end_date: ['']
  });
  ngOnInit(): void {
    this.getAnalytics();
  }

  getAnalytics() {
    let formVal = {
      start_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
      end_date: moment().endOf('year').format('YYYY-MM-DD')
    };
    this.analyticsSvc.GetAnalytics(formVal).subscribe({
      next: (resp) => {
        this.loaderService.hide();
        if (resp.status) {
          this.totalEarned = resp.data.summary.total_earned;
          this.totalRedeemed = resp.data.summary.total_redeemed;
          this.total_earning = resp.data.summary.total_earning;
          this.total_redemption = resp.data.summary.total_redemption;
          this.topUsersList = resp.data.top_users;
          resp.data.monthly_trend.forEach((element: any) => {
            this.earnedList.push(Number(element.earned));
            this.redeemedList.push(Number(element.redeemed));
            const formattedMonth = moment(element.month, 'YYYY-MM').format('MMM YY').toUpperCase();
            this.monthsList.push(formattedMonth);
          });
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastr.error(err.error.message, 'Error');
      }
    });
  }

  onSearchButton() {
    let formVal = this.SearchDashboardForm.value;

    if (formVal.start_date && formVal.end_date) {
      const startDate = moment(formVal.start_date, 'YYYY-MM-DD', true);
      const endDate = moment(formVal.end_date, 'YYYY-MM-DD', true);

      if (startDate.isValid() && endDate.isValid()) {
        this.datesError = !startDate.isBefore(endDate);
      } else {
        this.datesError = false;
      }
    } else {
      this.datesError = false;
    }

    if (!this.datesError) {
      formVal.start_date = moment(formVal.start_date).format('YYYY-MM-DD');
      formVal.end_date = moment(formVal.end_date).format('YYYY-MM-DD');
      this.analyticsSvc.GetAnalytics(formVal).subscribe({
        next: (resp) => {
          this.loaderService.hide();
          if (resp.status) {
            this.totalEarned = resp.data.summary.total_earned;
            this.totalRedeemed = resp.data.summary.total_redeemed;
            this.total_earning = resp.data.summary.total_earning;
            this.total_redemption = resp.data.summary.total_redemption;
            this.topUsersList = resp.data.top_users;

            const trend = resp.data.monthly_trend || [];

            this.earnedList = trend.map((element: any) => Number(element.earned));
            this.redeemedList = trend.map((element: any) => Number(element.redeemed));
            this.monthsList = trend.map((element: any) => moment(element.month, 'YYYY-MM').format('MMM YY').toUpperCase());
          }
        }
      });
    }
  }

  onUserHistory() {
    this.navRoute.navigate(['/user-history']);
  }
}
