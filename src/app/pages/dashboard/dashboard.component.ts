import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { AnalyticsDataService } from '../../service/anlytics/analytics-data.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: `./dashboard.component.html`,
})
export class DashboardComponent implements OnInit, OnDestroy {
  chartData: any = {};
  private themeSubscription: Subscription;
  private dataSubscription: Subscription;

  // time = new Date();

  constructor(
    private theme: NbThemeService,
    private dataService: AnalyticsDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      // Fetch realtime data and update chart data
      this.dataSubscription = this.dataService.getRealtimeAnalyticsData().pipe(
        map(data => this.transformData(data))
      ).subscribe(transformedData => {
        // console.log('dashboard: ', transformedData);
        // this.time = new Date();
        this.chartData = transformedData;
        this.cdr.detectChanges();
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

  transformData(data: any) {
    // Convert the event data to the format required by ECharts
    const hours: string[] = [];
    const methodNames: string[] = [];
    const seriesData: any[] = [];

    data.forEach(item => {
      if (!hours.length) {
        hours.push(...item.hours);
      }

      methodNames.push(item.methodName);

      seriesData.push({
        name: item.methodName,
        type: 'line',
        stack: 'Total',
        data: item.count
      });
    });

    return {
      hours,
      methodNames,
      seriesData
    };
  }
}
