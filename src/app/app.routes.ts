import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';
import { MissionFormComponent } from './manage/forms/mission-form/mission-form.component';
import { MissionTableComponent } from './manage/tables/mission-table/mission-table.component';
import { RocketFormComponent } from './manage/forms/rocket-form/rocket-form.component';
import { RocketTableComponent } from './manage/tables/rocket-table/rocket-table.component';
import { RocketTransferComponent } from './transfer/rocket-transfer.component';
import { ReportComponent } from './report/report.component';
import { UnassignedRocketFormComponent } from './manage/forms/unassigned-rocket-form/unassigned-rocket-form.component';
/**
 * Application routes for the Angular application.
 * This file defines the routes for the application, including paths for
 * mission and rocket tables and forms.
 * Each route is associated with a specific component that will be displayed
 * when the route is activated.
 */
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'mission-table',
    component: MissionTableComponent,
  },
  {
    path: 'mission-form/:operation/:id',
    component: MissionFormComponent,
  },
  {
    path: 'rocket-table/:missionId',
    component: RocketTableComponent,
  },
  {
    path: 'rocket-form/:missionId/:operation/:id',
    component: RocketFormComponent,
  },
  {
    path: 'unassigned-rocket-form',
    component: UnassignedRocketFormComponent,
  },
  {
    path: 'transfer',
    component: RocketTransferComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  // redirect to default
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
