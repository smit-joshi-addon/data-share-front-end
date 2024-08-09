import { NgModule } from '@angular/core';
import {
  NbCardModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { EchartsAreaStackComponent } from './echarts/echarts-area-stack.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule
  ],
  declarations: [
    DashboardComponent,
    EchartsAreaStackComponent
  ],
})
export class DashboardModule { }
