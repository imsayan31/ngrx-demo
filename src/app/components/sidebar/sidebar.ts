import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

interface MenuItem {
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {

  private authService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      roles: ['ADMIN']
    },
    {
      label: 'Dashboard',
      route: '/hr/dashboard',
      roles: ['HR_ADMIN']
    },
    {
      label: 'Dashboard',
      route: '/manager/dashboard',
      roles: ['MANAGER']
    },
    {
      label: 'Dashboard',
      route: '/employee/dashboard',
      roles: ['EMPLOYEE']
    },
    {
      label: 'Employees',
      route: '/employees',
      roles: ['ADMIN', 'HR_ADMIN']
    },
    {
      label: 'Departments',
      route: '#',
      roles: ['ADMIN', 'HR_ADMIN']
    },
    {
      label: 'Users',
      route: '#',
      roles: ['ADMIN']
    },
    {
      label: 'Roles & Permissions',
      route: '#',
      roles: ['ADMIN']
    },
    {
      label: 'Reports',
      route: '#',
      roles: ['ADMIN', 'HR_ADMIN', 'MANAGER']
    },
    {
      label: 'Audit Logs',
      route: '#',
      roles: ['ADMIN']
    },
    {
      label: 'Settings',
      route: '#',
      roles: ['ADMIN']
    }
  ];

  get visibleMenuItems(): MenuItem[] {
    const role = this.authService.getRole();

    return this.menuItems.filter(item =>
      role !== null && item.roles.includes(role)
    );
  }
}
