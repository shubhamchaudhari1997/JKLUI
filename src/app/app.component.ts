import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'healthcare-app';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCaregiver(): boolean {
    return this.authService.isCaregiver();
  }

  isPatient(): boolean {
    return this.authService.isPatient();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
