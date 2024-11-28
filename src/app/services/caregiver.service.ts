import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Caregiver {
  caregiverId: number;
  name: string;
  email: string;
  specialization: string;
  phoneNumber?: string;
  address?: string;
  patients?: any[];
  isAvailable: boolean;
}

export interface CaregiverPatientsResponse {
  caregiver: string;
  patients: Array<{
    patientId: number;
    name: string;
    dateOfBirth: string;
    address: string;
    medicalRecord: string;
  }>;
  totalPatients: number;
}

export interface CreateNoteRequest {
  noteContent: string;
  patientId: number;
  caregiverId: number;
}

export interface CaregiverUpdateDto {
  Name: string;
  Specialization: string;
  PhoneNumber: string;
  Address: string;
}

export interface UpdateAvailabilityDto {
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CaregiverService {
  private apiUrl = `${environment.apiUrl}/Caregiver`;
  private appointmentUrl = `${environment.apiUrl}/Appointment`;
  private currentCaregiverId: number | null = null;

  constructor(private http: HttpClient) { }

  getCaregivers(): Observable<Caregiver[]> {
    return this.http.get<Caregiver[]>(`${this.apiUrl}/GetCaregivers`).pipe(
      tap({
        next: (response) => {
          console.log('Caregivers API Response:', response);
        },
        error: (error) => {
          console.error('Caregivers API Error:', error);
        }
      })
    );
  }

  deleteCaregiver(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  getCaregiverPatients(caregiverId: string): Observable<CaregiverPatientsResponse> {
    debugger;
    const url = `${this.apiUrl}/patients/${caregiverId}`;
    console.log('Getting patients for caregiver:', url);
    
    return this.http.get<CaregiverPatientsResponse>(url).pipe(
      tap({
        next: (response) => {
          console.log('Caregiver patients response:', response);
        },
        error: (error) => {
          console.error('Error fetching caregiver patients:', error);
        }
      })
    );
  }

  getCaregiverDetails(userId: string): Observable<Caregiver> {
    return this.http.get<Caregiver>(`${this.apiUrl}/details/${userId}`).pipe(
      tap(caregiver => {
        debugger;
        console.log('Caregiver details:', caregiver);
        this.currentCaregiverId = caregiver.caregiverId;
        localStorage.setItem('caregiverId', caregiver.caregiverId.toString());
      })
    );
  }

  getCurrentCaregiverId(): number | null {
    debugger;
    if (this.currentCaregiverId) {
      return this.currentCaregiverId;
    }
    const storedId = localStorage.getItem('caregiverId');
    return storedId ? Number(storedId) : null;
  }
  addCaregiverNote(note: CreateNoteRequest): Observable<any> {
    debugger;
    const url = `${environment.apiUrl}/CaregiverNotes/CreateCaregiverNote`;
    
    const caregiverId = this.getCurrentCaregiverId();
    if (!caregiverId) {
      throw new Error('Caregiver ID not found');
    }

    const noteRequest = {
      noteContent: note.noteContent,
      patientId: note.patientId,
      caregiverId: caregiverId
    };

    console.log('Adding note:', noteRequest);
    console.log('API URL:', url);

    return this.http.post(url, noteRequest).pipe(
      tap({
        next: (response) => {
          console.log('Note added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding note:', error);
          console.error('Request body:', noteRequest);
          console.error('Error details:', error.error);
        }
      })
    );
  }

  updateCaregiverProfile(profile: any): Observable<any> {
    debugger;
    const caregiverId = this.getCurrentCaregiverId();
    if (!caregiverId) {
      throw new Error('Caregiver ID not found');
    }

    const url = `${this.apiUrl}/${caregiverId}`;
    const updateRequest: CaregiverUpdateDto = {
      Name: profile.Name,
      Specialization: profile.Specialization,
      PhoneNumber: profile.PhoneNumber,
      Address: profile.Address
    };

    console.log('Updating profile with:', updateRequest);
    console.log('API URL:', url);

    return this.http.put(url, updateRequest).pipe(
      tap({
        next: (response) => {
          console.log('Profile updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          console.error('Request body:', updateRequest);
          console.error('Error details:', error.error);
        }
      })
    );
  }

  updateAvailabilityStatus(isAvailable: boolean): Observable<any> {
    debugger;
    const caregiverId = this.getCurrentCaregiverId();
    if (!caregiverId) {
      throw new Error('Caregiver ID not found');
    }

    const url = `${this.apiUrl}/${caregiverId}/availability`;
    const updateRequest: UpdateAvailabilityDto = { isAvailable };

    console.log('Updating availability status:', updateRequest);
    console.log('API URL:', url);

    return this.http.patch(url, updateRequest).pipe(
      tap({
        next: (response) => {
          console.log('Availability status updated:', response);
        },
        error: (error) => {
          console.error('Error updating availability:', error);
          console.error('Request body:', updateRequest);
        }
      })
    );
  }

  getCaregiverAppointments(userId: string): Observable<any> {
    debugger;
    return this.http.get(`${this.apiUrl}/caregiverappointments/${userId}`);
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    debugger;
    const url = `${this.appointmentUrl}/UpdateStatus/${appointmentId}`;
    const updateRequest = { status };

    console.log('Updating appointment status:', { appointmentId, status });
    console.log('API URL:', url);

    return this.http.put(url, updateRequest).pipe(
      tap({
        next: (response) => {
          console.log('Appointment status updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating appointment status:', error);
          console.error('Request body:', updateRequest);
        }
      })
    );
  }
} 