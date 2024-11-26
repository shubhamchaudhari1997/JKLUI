import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    const authData = localStorage.getItem('authData');

    if (!authData) {
      this.toastr.error('Please login to continue');
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = JSON.parse(authData).userType;

    // Check if the route is for caregiver module
    if (state.url.includes('/caregiver')) {
      if (userRole === 1) { // Caregiver role
        return true;
      }
    }
    
    // Check if the route is for admin module
    if (state.url.includes('/dashboard') || state.url.includes('/patients') || state.url.includes('/caregivers')) {
      if (userRole === 0) { // Admin role
        return true;
      }
    }

    // Check if the route is for patient module
    if (state.url.includes('/patient')) {
      if (userRole === 2) { // Patient role
        return true;
      }
    }

    this.toastr.error("You don't have permission to access this page");
    
    // Redirect based on role
    if (userRole === 0) {
      this.router.navigate(['/dashboard']);
    } else if (userRole === 1) {
      this.router.navigate(['/caregiver']);
    } else if (userRole === 2) {
      this.router.navigate(['/patient']);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
} 