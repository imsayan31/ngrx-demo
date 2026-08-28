import { Routes } from '@angular/router';
import {EmployeeComponent} from './components/employee/employee';
import {LoginComponent} from './components/login/login';
import {authGuard} from './guards/auth-guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import {roleGuard} from './guards/role-guard-guard';
import {LayoutComponent} from './components/layout/layout';
import {HrAdminComponent} from './components/dashboards/hr-admin/hr-admin';
import {ManagerComponent} from './components/dashboards/manager/manager';

export const routes: Routes = [

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public route
  {
    path: 'login',
    component: LoginComponent
  },

  // Authenticated application
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMIN']
        }
      },
      {
        path: 'hr/dashboard',
        component: HrAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['HR_ADMIN']
        }
      },
      {
        path: 'manager/dashboard',
        component: ManagerComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['MANAGER']
        }
      },
      {
        path: 'employees',
        component: EmployeeComponent
      }
    ]
  },
];
