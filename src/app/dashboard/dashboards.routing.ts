import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: DashboardComponent,
        data: {
          title: 'Dashboard 1',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Dashboard 1' }
          ]
        }
      }      
    ]
  }
];
