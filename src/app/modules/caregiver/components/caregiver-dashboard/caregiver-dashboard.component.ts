import { Component, OnInit } from '@angular/core';
import { CaregiverDashboardService, CaregiverDashboardResponse } from '../../../../services/caregiver-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

interface DashboardStats {
  assignedPatients: number;
  totalAppointments: number;
  todayAppointments: number;
}

@Component({
  selector: 'app-caregiver-dashboard',
  templateUrl: './caregiver-dashboard.component.html',
  styleUrls: ['./caregiver-dashboard.component.scss']
})
export class CaregiverDashboardComponent implements OnInit {
  stats: DashboardStats = {
    assignedPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0
  };
  loading = true;
  caregiverName: string = '';

  constructor(
    private caregiverDashboardService: CaregiverDashboardService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    debugger;
    console.log('CaregiverDashboardComponent initialized');
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    debugger;
    console.log('Loading dashboard stats...');
    this.loading = true;
    
    this.caregiverDashboardService.getDashboardStats()
      .pipe(
        catchError(error => {
          debugger;
          console.error('Error loading dashboard stats:', error);
          
          if (error.message === 'No auth data found') {
            this.toastr.error('Session expired. Please login again.');
            this.router.navigate(['/login']);
          } else {
            this.toastr.error('Failed to load dashboard statistics');
          }
          
          return of({
            patients: { totalPatients: 0, caregiver: '', patients: [] },
            appointments: { totalAppointments: 0, caregiver: '', appointmentsByDate: [] },
            todayAppointments: { message: '', appointments: [] }
          });
        }),
        finalize(() => {
          this.loading = false;
          console.log('Dashboard stats loading completed');
        })
      )
      .subscribe({
        next: (response: CaregiverDashboardResponse) => {
          debugger;
          console.log('Dashboard data received:', response);
          
          this.stats = {
            assignedPatients: response.patients.totalPatients,
            totalAppointments: response.appointments.totalAppointments,
            todayAppointments: response.todayAppointments.appointments?.length || 0
          };

          this.caregiverName = response.patients.caregiver;
        }
      });
  }
} 