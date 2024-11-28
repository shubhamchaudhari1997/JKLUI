import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authData: AuthResponse | null = null;
  isAuthenticated = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastr: ToastrService
  ) {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      this.authData = JSON.parse(storedAuthData);
      this.isAuthenticated = true;
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  setAuthData(authResponse: AuthResponse) {
    console.log('Setting auth data:', authResponse);
    this.authData = authResponse;
    this.isAuthenticated = true;
    localStorage.setItem('authData', JSON.stringify(authResponse));
    this.toastr.success('Login successful');

    if (authResponse.userType === 0) { // Administrator
      this.router.navigate(['/dashboard']);
    } else if (authResponse.userType === 1) { // Caregiver
      this.router.navigate(['/caregiver']);
    } else if (authResponse.userType === 2) { // Patient
      this.router.navigate(['/patient']);
    }
  }

  getToken(): string | null {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData.token;
    }
    return null;
  }

  getUserType(): number | null {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData.userType;
    }
    return null;
  }

  logout() {
    this.authData = null;
    this.isAuthenticated = false;
    localStorage.removeItem('authData');
    localStorage.removeItem('caregiverId');
    this.router.navigate(['/login']);
  }

  getAuthData(): AuthResponse | null {
    return this.authData;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.authData?.userType === 0;
  }

  isCaregiver(): boolean {
    return this.authData?.userType === 1;
  }

  isPatient(): boolean {
    return this.authData?.userType === 2;
  }
} 