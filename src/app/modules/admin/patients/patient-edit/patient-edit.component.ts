import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../../services/patient.service';
import { CaregiverService, Caregiver } from '../../../../services/caregiver.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})
export class PatientEditComponent implements OnInit {
  patientForm: FormGroup;
  patientId: number = 0;
  loading = false;
  originalPatient: any = null;
  caregivers: Caregiver[] = [];
  selectedCaregiverId: number | null = null;
  newNote: string = '';
  notes: any[] = [];
  notesCollapsed = true;
  currentCaregiver: any = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: [''],
      medicalRecord: [''],
      caregiverId: [null]
    });
  }

  ngOnInit() {
    this.loading = true;
    const patientId = Number(this.route.snapshot.params['id']);
    
    if (!patientId || isNaN(patientId)) {
      this.toastr.error('Invalid patient ID');
      this.router.navigate(['/patients']);
      return;
    }

    // Load both patient and caregivers data simultaneously
    forkJoin({
      patient: this.patientService.getPatientById(patientId),
      caregivers: this.caregiverService.getCaregivers()
    }).subscribe({
      next: (data) => {
        // Set caregivers list
        this.caregivers = data.caregivers;

        // Set patient data
        this.originalPatient = data.patient;
        this.patientId = patientId;
        this.currentCaregiver = data.patient.caregiver;
        this.selectedCaregiverId = this.currentCaregiver?.caregiverId || null;
        this.notes = data.patient.notes || [];

        const dateOfBirth = new Date(data.patient.dateOfBirth)
          .toISOString().split('T')[0];

        debugger
        this.patientForm.patchValue({
          
          name: data.patient.name,
          dateOfBirth: dateOfBirth,
          address: data.patient.address || '',
          medicalRecord: data.patient.medicalRecord || '',
          caregiverId: this.selectedCaregiverId
        });

        console.log('Form values after patch:', this.patientForm.value);
        console.log('Medical Record:', data.patient.medicalRecord);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.toastr.error('Failed to load data');
        this.loading = false;
        this.router.navigate(['/patients']);
      }
    });
  }

  loadCaregivers() {
    this.caregiverService.getCaregivers().subscribe({
      next: (caregivers) => {
        this.caregivers = caregivers;
      },
      error: (error) => {
        console.error('Error loading caregivers:', error);
        this.toastr.error('Failed to load caregivers');
      }
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    this.loading = true;
    const formValues = this.patientForm.value;
    
    const updatedPatient = {
      ...this.originalPatient,
      ...formValues,
      patientId: this.patientId,
      caregiverId: formValues.caregiverId || null
    };

    this.patientService.updatePatient(updatedPatient).subscribe({
      next: () => {
        this.toastr.success('Patient updated successfully');
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        this.toastr.error('Failed to update patient');
        this.loading = false;
      }
    });
  }

  assignCaregiver() {
    const caregiverId = this.patientForm.get('caregiverId')?.value;
    if (!caregiverId) {
      this.toastr.error('Please select a caregiver');
      return;
    }

    this.loading = true;
    this.patientService.assignCaregiver(this.patientId, caregiverId).subscribe({
      next: () => {
        this.toastr.success('Caregiver assigned successfully');
        this.selectedCaregiverId = caregiverId;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error assigning caregiver:', error);
        this.toastr.error('Failed to assign caregiver');
        this.loading = false;
      }
    });
  }

  toggleNotes() {
    this.notesCollapsed = !this.notesCollapsed;
  }

  onCancel() {
    this.router.navigate(['/patients']);
  }

  hasChanges(): boolean {
    if (!this.originalPatient) return false;
    
    const currentValues = this.patientForm.value;
    return Object.keys(currentValues).some(key => 
      currentValues[key] !== this.originalPatient[key]
    );
  }

  addNote() {
    if (!this.newNote || this.newNote.trim().length === 0) {
      this.toastr.error('Please enter a note');
      return;
    }

    const caregiverId = this.patientForm.get('caregiverId')?.value;
    if (!caregiverId) {
      this.toastr.error('Please select a caregiver first');
      return;
    }

    const noteRequest = {
      noteContent: this.newNote.trim(),
      patientId: this.patientId,
      caregiverId: caregiverId
    };

    this.loading = true;
    this.patientService.addCaregiverNote(noteRequest).subscribe({
      next: () => {
        this.toastr.success('Note added successfully');
        this.newNote = '';
        // Refresh patient data to get updated notes
        this.patientService.getPatientById(this.patientId).subscribe({
          next: (data) => {
            this.originalPatient = data;
            this.notes = data.notes || [];
            this.loading = false;
          },
          error: (error) => {
            console.error('Error refreshing patient data:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error adding note:', error);
        this.toastr.error('Failed to add note');
        this.loading = false;
      }
    });
  }
} 