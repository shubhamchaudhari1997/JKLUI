import { Component, OnInit } from '@angular/core';
import { CaregiverService } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caregiver-availability',
  templateUrl: './caregiver-availability.component.html',
  styleUrls: ['./caregiver-availability.component.scss']
})
export class CaregiverAvailabilityComponent implements OnInit {
  isAvailable: boolean = false;
  loading: boolean = false;

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
        this.isAvailable = caregiver.isAvailable || false;
        console.log('Initial availability status:', this.isAvailable);
      },
      error: (error) => {
        console.error('Error loading availability status:', error);
        this.toastr.error('Failed to load availability status');
      }
    });
  }

  toggleAvailability() {
    this.loading = true;
    console.log('Toggling availability to:', !this.isAvailable);
    
    this.caregiverService.updateAvailabilityStatus(!this.isAvailable).subscribe({
      next: () => {
        this.isAvailable = !this.isAvailable;
        this.toastr.success(`You are now ${this.isAvailable ? 'available' : 'unavailable'} for assignments`);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating availability:', error);
        this.toastr.error('Failed to update availability status');
        this.loading = false;
      }
    });
  }
} 