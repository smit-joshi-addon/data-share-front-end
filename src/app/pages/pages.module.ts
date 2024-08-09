import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbInputModule, NbMenuModule, NbRadioModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { BusinessComponent } from './business/business.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NotFoundComponent } from './not-found/not-found.component';
import { DataMasterComponent } from './data-master/data-master.component';
import { DataDetailComponent } from './data-detail/data-detail.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    NbCardModule,
    ngFormsModule,
    NbInputModule,
    NbButtonModule,
    NbRadioModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    PagesComponent,
    BusinessComponent,
    DataMasterComponent,
    DataDetailComponent,
    NotFoundComponent
  ],
})
export class PagesModule {
}
