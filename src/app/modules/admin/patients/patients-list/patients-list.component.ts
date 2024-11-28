import { Component, OnInit } from '@angular/core';
import { PatientService, Patient } from '../../../../services/patient.service';
import { CaregiverService, Caregiver } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, catchError, of, tap } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  caregivers: Caregiver[] = [];
  loading = false;
  selectedPatient: Patient | null = null;
  deleteModal: any;

  constructor(
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadData();
    this.initializeModal();
  }

  initializeModal() {
    setTimeout(() => {
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    });
  }

  openDeleteModal(patient: Patient) {
    this.selectedPatient = patient;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.selectedPatient) return;

    this.loading = true;
    this.patientService.deletePatient(this.selectedPatient.patientId).subscribe({
      next: () => {
        this.toastr.success('Patient deleted successfully');
        this.deleteModal.hide();
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting patient:', error);
        this.toastr.error('Failed to delete patient');
        this.loading = false;
      }
    });
  }

  loadData() {
    this.loading = true;
    console.log('Starting to load data...');
    
    // Add error handling for each service call
    const patients$ = this.patientService.getPatients().pipe(
      tap(patients => console.log('Patients loaded:', patients)),
      catchError(error => {
        console.error('Error loading patients:', error);
        this.toastr.error('Failed to load patients');
        return of([]);
      })
    );

    const caregivers$ = this.caregiverService.getCaregivers().pipe(
      tap(caregivers => console.log('Caregivers loaded:', caregivers)),
      catchError(error => {
        console.error('Error loading caregivers:', error);
        this.toastr.error('Failed to load caregivers');
        return of([]);
      })
    );

    // Load both patients and caregivers data
    forkJoin({
      patients: patients$,
      caregivers: caregivers$
    }).subscribe({
      next: (data) => {
        console.log('Combined data received:', data);
        this.patients = data.patients;
        this.caregivers = data.caregivers;
        console.log('Caregivers array:', this.caregivers);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading data:', error);
        if (error.status === 0) {
          this.toastr.error('Unable to connect to the server. Please check your connection.');
        } else if (error.status === 401) {
          this.toastr.error('Unauthorized access. Please login again.');
        } else if (error.error?.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Failed to load data');
        }
        
        this.loading = false;
      },
      complete: () => {
        console.log('Data loading completed');
        console.log('Final caregivers array:', this.caregivers);
        this.loading = false;
      }
    });
  }

  getCaregiverName(caregiverId: number | undefined): string {
    console.log('Getting name for caregiverId:', caregiverId);
    console.log('Available caregivers:', this.caregivers);
    
    if (!caregiverId) return 'Not Assigned';
    const caregiver = this.caregivers.find(c => c.caregiverId === caregiverId);
    console.log('Found caregiver:', caregiver);
    return caregiver ? caregiver.name : 'Unknown';
  }
} 