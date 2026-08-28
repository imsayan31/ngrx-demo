import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {

  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }

}
