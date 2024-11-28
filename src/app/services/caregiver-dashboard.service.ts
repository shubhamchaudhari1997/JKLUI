import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CaregiverDashboardResponse {
  patients: {
    caregiver: string;
    patients: any[];
    totalPatients: number;
  };
  appointments: {
    caregiver: string;
    appointmentsByDate: any[];
    totalAppointments: number;
  };
  todayAppointments: {
    message?: string;
    appointments?: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CaregiverDashboardService {
  private apiUrl = `${environment.apiUrl}/Caregiver`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDashboardStats(): Observable<CaregiverDashboardResponse> {
    debugger;
    const authData = localStorage.getItem('authData');
    if (!authData) {
      throw new Error('No auth data found');
    }
    
    const caregiverId = JSON.parse(authData).userId;
    console.log('Using caregiverId from auth:', caregiverId);

    // Make three separate API calls
    const patients$ = this.http.get<any>(`${this.apiUrl}/patients/${caregiverId}`);
    const appointments$ = this.http.get<any>(`${this.apiUrl}/appointments/${caregiverId}`);
    const todayAppointments$ = this.http.get<any>(`${this.apiUrl}/today-appointments/${caregiverId}`);

    // Combine all three API calls
    return forkJoin({
      patients: patients$,
      appointments: appointments$,
      todayAppointments: todayAppointments$
    }).pipe(
      map(response => {
        console.log('Combined API responses:', response);
        return {
          patients: response.patients,
          appointments: response.appointments,
          todayAppointments: response.todayAppointments
        };
      })
    );
  }
} 