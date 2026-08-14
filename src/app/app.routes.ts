import { Routes } from '@angular/router';
import {EmployeeComponent} from './components/employee/employee';
import {LoginComponent} from './components/login/login';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'employees',
    component: EmployeeComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
