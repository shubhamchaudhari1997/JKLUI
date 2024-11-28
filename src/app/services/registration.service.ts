import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword:string;
  phoneNumber: string;
  address: string;
  userType: number;
  specialization?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/Auth`;
    console.log('API URL in Registration Service:', this.apiUrl);
  }

  register(registrationData: RegistrationData): Observable<any> {
    const url = `${this.apiUrl}/register`;
    console.log('Full Registration URL:', url);
    console.log('Environment:', environment);
    return this.http.post(url, registrationData);
  }
} 