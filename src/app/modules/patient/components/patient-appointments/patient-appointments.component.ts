import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../../../services/patient.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  notes: string;
  patientId: number;
  caregiverId: number;
  caregiverName?: string;
  status?: string;
}

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss']
})
export class PatientAppointmentsComponent implements OnInit {
  appointmentForm: FormGroup;
  appointments: Appointment[] = [];
  loading = false;
  currentPatientId: number | null = null;
  caregiverDetails: any = null;
  selectedAppointment: any = null;
  cancelModal: any;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }

    const userId = JSON.parse(authData).userId;
    this.loadPatientData(userId);

    // Initialize modal
    setTimeout(() => {
      this.cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    });
  }

  loadPatientData(userId: string) {
    this.loading = true;
    this.patientService.getPatientDetails(userId).subscribe({
      next: (data: any) => {
        this.currentPatientId = data.patientDetails.patientId;
        this.caregiverDetails = data.caregiverDetails;
        if (this.currentPatientId) {
          this.loadAppointments(this.currentPatientId);
        }
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.toastr.error('Failed to load patient data');
        this.loading = false;
      }
    });
  }

  loadAppointments(patientId: number) {
    this.appointmentService.getPatientAppointments(patientId).subscribe({
      next: (appointments) => {
        console.log('Appointments loaded:', appointments);
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.toastr.error('Failed to load appointments');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.invalid || !this.currentPatientId || !this.caregiverDetails) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const appointmentRequest = {
      appointmentDate: this.appointmentForm.get('appointmentDate')?.value,
      notes: this.appointmentForm.get('notes')?.value || '',
      patientId: this.currentPatientId,
      caregiverId: this.caregiverDetails.caregiverId
    };

    console.log('Creating appointment:', appointmentRequest);
    this.loading = true;

    this.appointmentService.createAppointment(appointmentRequest).subscribe({
      next: (response) => {
        console.log('Appointment created:', response);
        this.toastr.success('Appointment scheduled successfully');
        this.appointmentForm.reset();
        if (this.currentPatientId) {
          this.loadAppointments(this.currentPatientId);
        }
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this.toastr.error('Failed to schedule appointment');
        this.loading = false;
      }
    });
  }

  openCancelModal(appointment: Appointment) {
    console.log('Opening cancel modal for appointment:', appointment);
    this.selectedAppointment = appointment;
    this.cancelModal.show();
  }

  confirmCancel() {
    if (!this.selectedAppointment) return;

    this.loading = true;
    console.log('Canceling appointment:', this.selectedAppointment);

    this.appointmentService.cancelAppointment(this.selectedAppointment.appointmentId).subscribe({
      next: () => {
        this.toastr.success('Appointment cancelled successfully');
        this.cancelModal.hide();
        if (this.currentPatientId) {
          this.loadAppointments(this.currentPatientId);
        }
      },
      error: (error) => {
        console.error('Error cancelling appointment:', error);
        this.toastr.error('Failed to cancel appointment');
        this.loading = false;
      }
    });
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }
} 