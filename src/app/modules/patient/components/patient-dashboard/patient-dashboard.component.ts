import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient.service';
import { ToastrService } from 'ngx-toastr';

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}

interface CaregiverDetails {
  caregiverId: number;
  name: string;
  specialization: string;
  isAvailable: boolean;
  isActive: boolean;
}

interface PatientDetails {
  patientId: number;
  name: string;
  address: string;
  medicalRecord: string;
  dateOfBirth: string;
  notes?: Array<{
    noteId: number;
    noteContent: string;
    createdAt: string;
  }>;
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  loading = false;
  userDetails: UserDetails | null = null;
  patientDetails: PatientDetails | null = null;
  caregiverDetails: CaregiverDetails | null = null;
  notes: any[] = [];
  currentPatientId: number | null = null;

  constructor(
    private patientService: PatientService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadPatientData();
  }

  loadPatientData() {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }

    const userId = JSON.parse(authData).userId;
    this.loading = true;

    this.patientService.getPatientDetails(userId).subscribe({
      next: (data: any) => {
        this.userDetails = data.userDetails;
        this.patientDetails = data.patientDetails;
        this.caregiverDetails = data.caregiverDetails;
        
        this.currentPatientId = this.patientDetails?.patientId || null;
        
        if (this.currentPatientId) {
          this.loadPatientNotes(this.currentPatientId);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.toastr.error('Failed to load patient data');
        this.loading = false;
      }
    });
  }

  loadPatientNotes(patientId: number) {
    this.patientService.getPatientById(patientId).subscribe({
      next: (data) => {
        this.notes = data.notes || [];
      },
      error: (error) => {
        console.error('Error loading patient notes:', error);
        this.toastr.error('Failed to load notes');
      }
    });
  }

  get patientName(): string {
    return this.patientDetails?.name || `${this.userDetails?.firstName} ${this.userDetails?.lastName}` || 'Patient';
  }

  get caregiverName(): string {
    return this.caregiverDetails?.name || 'Not assigned';
  }

  get caregiverSpecialization(): string {
    return this.caregiverDetails?.specialization || '';
  }
} 