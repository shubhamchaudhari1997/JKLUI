import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth.model';
import { AuthService } from './auth.service';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  address?: string;
  userType: number;
  specialization?: string;
  isActive: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/api/Auth/register`;

  constructor(
    private http: HttpClient
  ) { }

  register(userData: RegistrationData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, userData);
  }
} 