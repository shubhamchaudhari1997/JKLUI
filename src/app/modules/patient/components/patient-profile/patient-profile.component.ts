import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '../../../../services/patient.service';
import { ToastrService } from 'ngx-toastr';

interface PatientProfileResponse {
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

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  originalProfile: PatientProfileResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      medicalRecord: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }

    const userId = JSON.parse(authData).userId;
    this.loading = true;

    this.patientService.getPatientDetails(userId).subscribe({
      next: (response: PatientProfileResponse) => {
        console.log('Profile response:', response);
        this.originalProfile = response;
        
        this.profileForm.patchValue({
          name: response.patientDetails.name,
          email: response.userDetails.email,
          dateOfBirth: new Date(response.patientDetails.dateOfBirth).toISOString().split('T')[0],
          address: response.patientDetails.address || '',
          medicalRecord: response.patientDetails.medicalRecord || ''
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.toastr.error('Failed to load profile data');
        this.loading = false;
      }
    });
  }
} 