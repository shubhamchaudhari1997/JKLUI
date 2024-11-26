import { Component, OnInit } from '@angular/core';
import { CaregiverService } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  notes: string;
  patientId: number;
  patientName: string;
  caregiverId: number;
  status: string;
}

@Component({
  selector: 'app-caregiver-appointments',
  templateUrl: './caregiver-appointments.component.html',
  styleUrls: ['./caregiver-appointments.component.scss']
})
export class CaregiverAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  selectedAppointment: Appointment | null = null;
  statusModal: any;
  userId: string = '';

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

    this.userId = JSON.parse(authData).userId;
    this.loadAppointments(this.userId);

    // Initialize modal
    setTimeout(() => {
      this.statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
    });
  }

  loadAppointments(userId: string) {
    this.loading = true;
    this.caregiverService.getCaregiverAppointments(userId).subscribe({
      next: (appointments) => {
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

  openStatusModal(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.statusModal.show();
  }

  updateStatus(status: 'Confirmed' | 'Rejected') {
    if (!this.selectedAppointment) return;

    this.loading = true;
    console.log('Updating appointment status:', { 
      appointmentId: this.selectedAppointment.appointmentId, 
      status 
    });

    this.caregiverService.updateAppointmentStatus(this.selectedAppointment.appointmentId, status).subscribe({
      next: () => {
        this.toastr.success(`Appointment ${status.toLowerCase()} successfully`);
        this.statusModal.hide();
        if (this.userId) {
          this.loadAppointments(this.userId);
        }
      },
      error: (error) => {
        console.error('Error updating appointment status:', error);
        this.toastr.error('Failed to update appointment status');
        this.loading = false;
      }
    });
  }
} 