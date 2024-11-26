import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../../../../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalCaregivers: 0,
    totalPatients: 0,
    availableCaregivers: 0,
    assignedCaregivers: 0,
    pendingAppointments: 0
  };
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.toastr.error('Failed to load dashboard statistics');
        this.loading = false;
      }
    });
  }
} 