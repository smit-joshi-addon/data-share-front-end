import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EChartsOption } from 'echarts'; // Import types for options
import * as echarts from 'echarts';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" (chartInit)="onChartInit($event)" class="echart"></div>
     <!-- <div [innerText]="changesTime"></div> -->
  `,

})
export class EchartsAreaStackComponent implements OnChanges {
  @Input() data: any = {};
  // @Input() time: any = '';

  // changesTime = '';

  options: EChartsOption = {};
  private chartInstance: echarts.ECharts | undefined;

  constructor(private theme: NbThemeService) { }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges triggered', changes);
    if (changes['data'] && this.chartInstance) {
      // console.log('chart: ', this.data);
      this.data = { ...this.data };
      this.updateChartOptions(this.data);
    }
    if (changes['time']) {
      // this.changesTime = this.time;
    }
  }

  onChartInit(chart: echarts.ECharts) {
    this.chartInstance = chart;
  }

  updateChartOptions(data: any) {
    if (this.chartInstance) {
      this.theme.getJsTheme().subscribe(config => {
        const colors: any = config.variables;
        const echartsTheme: any = config.variables.echarts;

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
            data: data.methodNames,
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
              data: data.hours,
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
          series: data.seriesData,
        });
      });
    } else {
      console.warn('Chart instance is not available');
    }
  }
}
