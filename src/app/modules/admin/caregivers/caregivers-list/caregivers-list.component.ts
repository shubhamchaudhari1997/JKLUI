import { Component, OnInit } from '@angular/core';
import { CaregiverService } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-caregivers-list',
  templateUrl: './caregivers-list.component.html',
  styleUrls: ['./caregivers-list.component.scss']
})
export class CaregiversListComponent implements OnInit {
  caregivers: any[] = [];
  loading = false;
  selectedCaregiver: any = null;
  deleteModal: any;

  constructor(
    private caregiverService: CaregiverService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadCaregivers();
    setTimeout(() => {
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
        backdrop: false,
        keyboard: true
      });
    });
  }

  loadCaregivers() {
    this.loading = true;
    this.caregiverService.getCaregivers().subscribe({
      next: (caregivers) => {
        this.caregivers = caregivers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading caregivers:', error);
        this.toastr.error('Failed to load caregivers');
        this.loading = false;
      }
    });
  }

  openDeleteConfirmation(caregiver: any) {
    this.selectedCaregiver = caregiver;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.selectedCaregiver) return;
    
    this.loading = true;
    this.caregiverService.deleteCaregiver(this.selectedCaregiver.caregiverId).subscribe({
      next: () => {
        this.toastr.success('Caregiver deleted successfully');
        this.deleteModal.hide();
        this.loadCaregivers();
      },
      error: (error) => {
        console.error('Error deleting caregiver:', error);
        this.toastr.error('Failed to delete caregiver');
        this.loading = false;
      }
    });
  }
} 