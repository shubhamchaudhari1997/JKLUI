import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastr.error('Please enter both email and password');
      return;
    }

    this.loading = true;
    console.log('Attempting login with:', this.loginData);

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.isSuccess) {
          // Navigation is handled in auth service
        } else {
          this.toastr.error(response.message || 'Login failed');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.toastr.error(error.error?.message || 'Login failed');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
} 