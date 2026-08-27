import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent {

  private authService = inject(AuthService);

  username = this.authService.getUsername();
  role = this.authService.getRole();

  statistics = [
    {
      title: 'Total Employees',
      value: 125,
      icon: '👥'
    },
    {
      title: 'Departments',
      value: 12,
      icon: '🏢'
    },
    {
      title: 'Total Users',
      value: 140,
      icon: '👤'
    },
    {
      title: 'Active Users',
      value: 118,
      icon: '✓'
    }
  ];

  recentActivities = [
    'Employee Sayan was added',
    'Employee Rahul was updated',
    'New user account was created',
    'Engineering department was updated'
  ];

}
