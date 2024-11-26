import { Component, OnInit } from '@angular/core';
import { CaregiverService, CreateNoteRequest } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

interface Patient {
  patientId: number;
  name: string;
  dateOfBirth: string;
  address: string;
  medicalRecord: string;
  notes?: Array<{
    noteId: number;
    noteContent: string;
    createdAt: string;
  }>;
}

@Component({
  selector: 'app-caregiver-patients',
  templateUrl: './caregiver-patients.component.html',
  styleUrls: ['./caregiver-patients.component.scss']
})
export class CaregiverPatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  selectedPatient: Patient | null = null;
  newNote: string = '';
  modal: any;

  constructor(
    private caregiverService: CaregiverService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }
    
    const userId = JSON.parse(authData).userId;
    
    this.caregiverService.getCaregiverDetails(userId).subscribe({
      next: (caregiver) => {
        console.log('Caregiver details loaded:', caregiver);
      },
      error: (error) => {
        console.error('Error loading caregiver details:', error);
        this.toastr.error('Failed to load caregiver details');
      }
    });

    this.loadPatients();

    setTimeout(() => {
      this.modal = new bootstrap.Modal(document.getElementById('addNoteModal'));
    });
  }

  loadPatients() {
    this.loading = true;
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }
    
    const userId = JSON.parse(authData).userId;
    console.log('Loading patients for user ID:', userId);
    
    this.caregiverService.getCaregiverPatients(userId).subscribe({
      next: (response) => {
        debugger;
        console.log('Patients loaded:', response);
        this.patients = response.patients;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading patients:', error);
        this.toastr.error('Failed to load patients');
        this.loading = false;
      }
    });
  }

  openAddNoteModal(patient: Patient) {
    this.selectedPatient = patient;
    this.newNote = '';
    if (this.modal) {
      this.modal.show();
    } else {
      this.toastr.error('Could not open modal');
    }
  }

  addNote() {
    if (!this.newNote?.trim() || !this.selectedPatient) {
      this.toastr.error('Please enter a note');
      return;
    }

    const caregiverId = this.caregiverService.getCurrentCaregiverId();
    if (!caregiverId) {
      this.toastr.error('Caregiver ID not found');
      return;
    }
    
    const noteRequest: CreateNoteRequest = {
      patientId: this.selectedPatient.patientId,
      caregiverId: caregiverId,
      noteContent: this.newNote.trim()
    };

    console.log('Sending note request:', noteRequest);
    this.loading = true;
     debugger;
    this.caregiverService.addCaregiverNote(noteRequest).subscribe({
      next: (response) => {
        console.log('Note added:', response);
        this.toastr.success('Note added successfully');
        if (this.modal) {
          this.modal.hide();
        }
        this.newNote = '';
        this.selectedPatient = null;
        this.loadPatients(); // Refresh the list to show new note
      },
      error: (error) => {
        console.error('Error adding note:', error);
        this.toastr.error('Failed to add note');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 