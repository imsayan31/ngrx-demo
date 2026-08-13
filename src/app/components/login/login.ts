import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login(
      this.username,
      this.password
    ).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.message = `${response.message} login successful`;
        // We'll store the JWT here in the next step
        this.authService.saveToken(response.token);
        console.log('JWT:', response.token);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message = 'Invalid username or password';
      }
    });
  }

}
