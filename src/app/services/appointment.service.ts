import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AppointmentRequest {
  appointmentDate: string;
  notes: string;
  patientId: number;
  caregiverId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/Appointment`;

  constructor(private http: HttpClient) { }

  // Get patient appointments
  getPatientAppointments(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}`);
  }

  // Create new appointment
  createAppointment(appointment: AppointmentRequest): Observable<any> {
    const url = `${this.apiUrl}/PostAppointment`;
    
    const appointmentRequest = {
      appointmentDate: appointment.appointmentDate,
      notes: appointment.notes,
      patientId: appointment.patientId,
      caregiverId: appointment.caregiverId,
      status: "Pending"
    };

    console.log('Creating appointment:', appointmentRequest);
    console.log('API URL:', url);

    return this.http.post(url, appointmentRequest).pipe(
      tap({
        next: (response) => {
          console.log('Appointment created successfully:', response);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          console.error('Request body:', appointmentRequest);
        }
      })
    );
  }

  // Cancel appointment
  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${appointmentId}`);
  }
} 