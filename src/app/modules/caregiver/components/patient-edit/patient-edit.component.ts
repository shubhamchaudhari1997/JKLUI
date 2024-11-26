import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../../services/patient.service';

declare var bootstrap: any;

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
  notes: any[] = [];
  notesAccordion: any;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: [''],
      medicalRecord: ['']
    });
  }

  ngOnInit() {
    this.loading = true;
    const patientId = Number(this.route.snapshot.params['id']);
    
    if (!patientId || isNaN(patientId)) {
      this.toastr.error('Invalid patient ID');
      this.router.navigate(['/caregiver/patients']);
      return;
    }

    this.patientService.getPatientById(patientId).subscribe({
      next: (data) => {
        this.originalPatient = data;
        this.patientId = patientId;
        this.notes = data.notes || [];

        const dateOfBirth = new Date(data.dateOfBirth)
          .toISOString().split('T')[0];

        this.patientForm.patchValue({
          name: data.name,
          dateOfBirth: dateOfBirth,
          address: data.address || '',
          medicalRecord: data.medicalRecord || ''
        });
        
        this.loading = false;

        setTimeout(() => {
          const accordionElement = document.getElementById('notesCollapse');
          if (accordionElement) {
            this.notesAccordion = new bootstrap.Collapse(accordionElement, {
              toggle: false
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.toastr.error('Failed to load patient data');
        this.loading = false;
        this.router.navigate(['/caregiver/patients']);
      }
    });
  }

  toggleNotes() {
    if (this.notesAccordion) {
      this.notesAccordion.toggle();
    }
  }

  onSubmit() {
    if (this.patientForm.invalid) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    this.loading = true;
    const formValues = this.patientForm.value;
    
    const updatedPatient = {
      patientId: this.patientId,
      name: formValues.name,
      dateOfBirth: formValues.dateOfBirth,
      address: formValues.address,
      medicalRecord: formValues.medicalRecord,
      caregiverId: this.originalPatient.caregiver?.caregiverId
    };

    console.log('Updating patient with:', updatedPatient);

    this.patientService.updatePatient(updatedPatient).subscribe({
      next: () => {
        this.toastr.success('Patient updated successfully');
        this.router.navigate(['/caregiver/patients']);
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        this.toastr.error('Failed to update patient');
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/caregiver/patients']);
  }

  hasChanges(): boolean {
    if (!this.originalPatient) return false;
    
    const currentValues = this.patientForm.value;
    return Object.keys(currentValues).some(key => 
      currentValues[key] !== this.originalPatient[key]
    );
  }
} 