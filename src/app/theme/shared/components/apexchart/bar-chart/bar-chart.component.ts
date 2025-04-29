// angular import
import { Component, Input, OnInit, ViewChild } from '@angular/core';

// project import

// third party
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ApexOptions>;

  @Input() earnedList: number[] = [];
  @Input() redeemedList: number[] = [];
  @Input() monthsList: string[] = [];

  // Constructor
  constructor() {
  }
  
  ngOnInit(): void {
    
    console.log("Earned List: ", this.earnedList);
    console.log("Redeemed List: ", this.redeemedList);
    console.log("Months List: ", this.monthsList);
    this.chartOptions = {
      series: [
        {
          name: 'Earned',
          data: this.earnedList
        },
        {
          name: 'Redeemed',
          data: this.redeemedList
        }
      ],
      dataLabels: {
        enabled: false
      },
      chart: {
        type: 'bar',
        height: 480,
        stacked: true,
        toolbar: {
          show: true
        },
        background: 'transparent'
      },
      colors: ['#2196f3', '#673ab7'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: this.monthsList
      },
      tooltip: {
        theme: 'light'
      }
    };
    
  }
}
