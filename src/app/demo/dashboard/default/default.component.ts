// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BajajChartComponent } from 'src/app/theme/shared/components/apexchart/bajaj-chart/bajaj-chart.component';
import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';
import { ChartDataMonthComponent } from 'src/app/theme/shared/components/apexchart/chart-data-month/chart-data-month.component';
import { Router } from '@angular/router';
import { UserHistoryService } from 'src/app/services/user-history-service/user-history.service';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

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
  datesError: boolean= false;
  constructor(private fb: FormBuilder, private navRoute: Router, private analyticsSvc: UserHistoryService){}

  SearchDashboardForm = this.fb.group({
    start_date: [''],
    end_date: ['']
  })
  ngOnInit(): void {
    this.getAnalytics();
  }

  getAnalytics(){
    let formVal = {
      start_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'), 
      end_date: moment().endOf('year').format('YYYY-MM-DD')
    }
    this.analyticsSvc.GetAnalytics(formVal).subscribe({
      next: (resp)=>{
        if(resp.status){
          this.totalEarned = resp.data.summary.total_earned;
          this.totalRedeemed = resp.data.summary.total_redeemed;
          this.topUsersList = resp.data.top_users;
          resp.data.monthly_trend.forEach((element: any) => {
            this.earnedList.push(Number(element.earned));
            this.redeemedList.push(Number(element.redeemed));
            const formattedMonth = moment(element.month, 'YYYY-MM').format('MMM YY').toUpperCase();
            this.monthsList.push(formattedMonth);
          });
          
        }
      }
    })
  }

  onSearchButton(){
    let formVal = this.SearchDashboardForm.value;


    if(formVal.start_date && formVal.end_date){
      const startDate = moment(formVal.start_date);
      const endDate = moment(formVal.end_date);

      if (startDate.isBefore(endDate)) {
        this.datesError = false;
      } else {
        this.datesError = true;
      }
    }

    if(!this.datesError){
      formVal.start_date = moment(formVal.start_date).format('YYYY-MM-DD');
      formVal.end_date = moment(formVal.end_date).format('YYYY-MM-DD');
      console.log("FormVal: ", formVal);
      this.analyticsSvc.GetAnalytics(formVal).subscribe({
        next: (resp)=>{
          if(resp.status){
            this.topUsersList = resp.data.top_users
          }
        }
      })
    }

    
  }

  // public method
  // ListGroup = [
  //   {
  //     name: 'Bajaj Finery',
  //     profit: '10% Profit',
  //     invest: '$1839.00',
  //     bgColor: 'bg-light-success',
  //     icon: 'ti ti-chevron-up',
  //     color: 'text-success'
  //   },
  //   {
  //     name: 'TTML',
  //     profit: '10% Loss',
  //     invest: '$100.00',
  //     bgColor: 'bg-light-danger',
  //     icon: 'ti ti-chevron-down',
  //     color: 'text-danger'
  //   },
  //   {
  //     name: 'Reliance',
  //     profit: '10% Profit',
  //     invest: '$200.00',
  //     bgColor: 'bg-light-success',
  //     icon: 'ti ti-chevron-up',
  //     color: 'text-success'
  //   },
  //   {
  //     name: 'ATGL',
  //     profit: '10% Loss',
  //     invest: '$189.00',
  //     bgColor: 'bg-light-danger',
  //     icon: 'ti ti-chevron-down',
  //     color: 'text-danger'
  //   },
  //   {
  //     name: 'Stolon',
  //     profit: '10% Profit',
  //     invest: '$210.00',
  //     bgColor: 'bg-light-success',
  //     icon: 'ti ti-chevron-up',
  //     color: 'text-success',
  //     space: 'pb-0'
  //   }
  // ];

  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];

  onUserHistory(){
    this.navRoute.navigate(['/user-history']);
  }
}
