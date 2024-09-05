import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { map } from 'rxjs/operators';
import { AnalyticsDataService } from '../../../service/anlytics/analytics-data.service';
import { Subscription } from 'rxjs';
import { EChartsOption } from 'echarts'; // Import types for options
import * as echarts from 'echarts';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" (chartInit)="onChartInit($event)" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements AfterViewInit, OnDestroy {
  options: EChartsOption = {}; // Use EChartsOption type
  themeSubscription: Subscription;
  dataSubscription: Subscription;
  private chartInstance: echarts.ECharts | undefined;

  constructor(private theme: NbThemeService, private dataService: AnalyticsDataService) { }

  ngAfterViewInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echartsTheme: any = config.variables.echarts;

      // Fetch Realtime data and update chart options
      this.dataSubscription = this.dataService.getRealtimeAnalyticsData().pipe(
        map(data => this.transformData(data))
      ).subscribe(transformedData => {
        this.updateChartOptions(transformedData, echartsTheme, colors);
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
    if (this.chartInstance) {
      this.chartInstance.dispose(); // Dispose of the chart instance to free up resources
    }
  }

  onChartInit(chart: echarts.ECharts) {
    this.chartInstance = chart;
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

  updateChartOptions(transformedData: any, echartsTheme: any, colors: any) {
    const { hours, methodNames, seriesData } = transformedData;

    // Default colors in case theme colors are not defined
    const defaultColors = {
      backgroundColor: '#fff',
      axisLineColor: '#333',
      tooltipBackgroundColor: '#fff',
      textColor: '#000',
      splitLineColor: '#e0e0e0',
      seriesColors: ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'] // Sample colors
    };

    const backgroundColor = echartsTheme.bg || defaultColors.backgroundColor;
    const axisLineColor = echartsTheme.axisLineColor || defaultColors.axisLineColor;
    const tooltipBackgroundColor = echartsTheme.tooltipBackgroundColor || defaultColors.tooltipBackgroundColor;
    const textColor = echartsTheme.textColor || defaultColors.textColor;
    const splitLineColor = echartsTheme.splitLineColor || defaultColors.splitLineColor;
    const seriesColors = [
      colors.warningLight || defaultColors.seriesColors[0],
      colors.infoLight || defaultColors.seriesColors[1],
      colors.dangerLight || defaultColors.seriesColors[2],
      colors.successLight || defaultColors.seriesColors[3],
      colors.primaryLight || defaultColors.seriesColors[4]
    ];

    if (this.chartInstance) {
      this.chartInstance.setOption({
        backgroundColor,
        color: seriesColors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: methodNames,
          textStyle: {
            color: textColor,
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
            data: hours,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: textColor,
              },
            },
          },
        ],
        series: seriesData,
      });
    } else {
      console.warn('Chart instance is not available');
    }
  }

}
