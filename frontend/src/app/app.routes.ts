import { Routes } from '@angular/router';
import { AppLayoutComponent } from '../layout/app-layout';
import { HistoryComponent, HomeComponent } from '../pages';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
    ],
  },
];
