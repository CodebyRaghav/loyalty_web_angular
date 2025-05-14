import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ApexOptions>;

  @Input() earnedList: number[] = [];
  @Input() redeemedList: number[] = [];
  @Input() monthsList: string[] = [];

  // Constructor
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['earnedList'] || 
      changes['redeemedList'] || 
      changes['monthsList']
    ) {
      this.updateChart(); // ← Redraw the chart when input data changes
    }
  }

  updateChart() {
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
