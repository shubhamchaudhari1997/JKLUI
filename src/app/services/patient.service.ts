import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface Patient {
  patientId: number;
  name: string;
  email?: string;
  dateOfBirth: string;
  address?: string;
  medicalRecord?: string;
  caregiverId?: number;
  caregiverName?: string;
  caregiver?: {
    caregiverId: number;
    name: string;
    specialization: string;
    isAvailable: boolean;
    isActive: boolean;
  };
  notes?: Array<{
    noteId: number;
    noteContent: string;
    createdAt: string;
  }>;
}

export interface PatientProfileResponse {
  userDetails: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    userName: string;
    isActive: boolean;
    createdAt: string;
    userType: number;
  };
  patientDetails: {
    patientId: number;
    name: string;
    address: string;
    medicalRecord: string;
    dateOfBirth: string;
    caregiverId: number;
  };
  caregiverDetails: {
    caregiverId: number;
    name: string;
    specialization: string;
    isAvailable: boolean;
    isActive: boolean;
  };
}

export interface CreateNoteRequest {
  noteContent: string;
  patientId: number;
  caregiverId: number;
}

export interface AppointmentRequest {
  appointmentDate: string;
  notes: string;
  patientId: number;
  caregiverId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/Patient`;
  private appointmentUrl = `${environment.apiUrl}/Appointment`;

  constructor(private http: HttpClient) { }

  // Get all patients (for admin)
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/GetPatients`);
  }

  // Get patient details (for patient login)
  getPatientDetails(userId: string): Observable<PatientProfileResponse> {
    return this.http.get<PatientProfileResponse>(`${this.apiUrl}/details/${userId}`);
  }

  // Get specific patient by ID
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  // Update patient profile
  updatePatientProfile(patient: Patient): Observable<any> {
    return this.http.put(`${this.apiUrl}/${patient.patientId}`, patient);
  }

  // Update patient (for admin/caregiver)
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put(`${this.apiUrl}/${patient.patientId}`, patient);
  }

  // Delete patient (for admin)
  // deletePatient(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }

  deletePatient(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  // Assign caregiver to patient (for admin)
  assignCaregiver(patientId: number, caregiverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${patientId}/assign-caregiver/${caregiverId}`, {});
  }

  // Add caregiver note
  addCaregiverNote(note: CreateNoteRequest): Observable<any> {
    const url = `${environment.apiUrl}/CaregiverNotes/CreateCaregiverNote`;
    return this.http.post(url, note);
  }

  // Get patient appointments
  getPatientAppointments(patientId: number): Observable<any> {
    return this.http.get(`${this.appointmentUrl}/patient/${patientId}`);
  }

  // Create new appointment
  createAppointment(appointment: AppointmentRequest): Observable<any> {
    debugger;
    const url = `https://jkl-healthcare-api.azurewebsites.net/api/Appointment/PostAppointment`;
    
    const appointmentRequest = {
      appointmentDate: appointment.appointmentDate,
      notes: appointment.notes,
      patientId: appointment.patientId,
      caregiverId: appointment.caregiverId,
      status : "Pending"
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
    debugger
    return this.http.delete(`${this.appointmentUrl}/${appointmentId}`, {});
  }
} 