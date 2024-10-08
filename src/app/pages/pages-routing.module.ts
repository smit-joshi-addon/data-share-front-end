import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BusinessComponent } from './business/business.component';
import { DataMasterComponent } from './data-master/data-master.component';
import { authGuard } from '../guard/auth/auth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivateChild: [authGuard],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'business',
      component: BusinessComponent,
    },
    {
      path: 'data-master',
      component: DataMasterComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
