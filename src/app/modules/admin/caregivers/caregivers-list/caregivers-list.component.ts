import { Component, OnInit } from '@angular/core';
import { CaregiverService, Caregiver } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-caregivers-list',
  templateUrl: './caregivers-list.component.html',
  styleUrls: ['./caregivers-list.component.scss']
})
export class CaregiversListComponent implements OnInit {
  caregivers: Caregiver[] = [];
  loading = false;
  selectedCaregiver: Caregiver | null = null;
  deleteModal: any;

  constructor(
    private caregiverService: CaregiverService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadCaregivers();
    // Initialize the modal
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  }

  loadCaregivers() {
    this.loading = true;
    this.caregiverService.getCaregivers().subscribe({
      next: (data) => {
        console.log('Caregivers loaded:', data);
        this.caregivers = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading caregivers:', error);
        this.toastr.error('Failed to load caregivers');
        this.loading = false;
      }
    });
  }

  openDeleteConfirmation(caregiver: Caregiver) {
    this.selectedCaregiver = caregiver;
    this.deleteModal.show();
  }

  cancelDelete() {
    this.selectedCaregiver = null;
    this.deleteModal.hide();
  }

  confirmDelete() {
    if (!this.selectedCaregiver) return;

    this.loading = true;
    this.caregiverService.deleteCaregiver(this.selectedCaregiver.caregiverId).subscribe({
      next: () => {
        this.toastr.success(`Caregiver ${this.selectedCaregiver?.name} deleted successfully`);
        this.loadCaregivers();
        this.deleteModal.hide();
        this.selectedCaregiver = null;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting caregiver:', error);
        if (error.status === 409) {
          this.toastr.error('Cannot delete caregiver with assigned patients');
        } else {
          this.toastr.error('Failed to delete caregiver');
        }
        this.loading = false;
        this.deleteModal.hide();
        this.selectedCaregiver = null;
      }
    });
  }
} 