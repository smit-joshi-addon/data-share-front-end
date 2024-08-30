import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { map } from 'rxjs/operators';
import { AnalyticsDataService } from '../../../service/anlytics/analytics-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: Subscription;
  dataSubscription: Subscription;

  constructor(private theme: NbThemeService, private dataService: AnalyticsDataService) { }

  ngAfterViewInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      // Fetch and process data
      this.dataSubscription = this.dataService.getAnalyticsData().pipe(
        map(data => this.processData(data))
      ).subscribe({
        next: (processedData) => {
          this.updateChartOptions(processedData, echarts, colors);
        },
        error: (err) => {
          console.error('Error fetching data', err);
          // Handle error appropriately
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  processData(data: any[]): any {
    if (!Array.isArray(data)) {
      console.error('API response is not an array', data);
      return {};
    }

    // Process the data to group by hour
    const grouped = data.reduce((acc, entry) => {
      const hour = new Date(entry.calledAt).getHours();
      const hourKey = `${hour}:00`;

      if (!acc[hourKey]) {
        acc[hourKey] = 0;
      }
      acc[hourKey] += 1; // Count the occurrences
      return acc;
    }, {});

    return grouped;
  }

  updateChartOptions(groupedData: any, echarts: any, colors: any) {
    // Generate chart options based on processed data
    this.options = {
      backgroundColor: echarts.bg,
      color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: echarts.tooltipBackgroundColor,
          },
        },
      },
      legend: {
        data: ['getData'],
        textStyle: {
          color: echarts.textColor,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: Object.keys(groupedData), // Hours
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: echarts.splitLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      series: [
        {
          name: 'getData',
          type: 'line',
          stack: 'Total amount',
          areaStyle: { normal: { opacity: echarts.areaOpacity } },
          data: Object.values(groupedData), // Values
        },
      ],
    };
  }
}
