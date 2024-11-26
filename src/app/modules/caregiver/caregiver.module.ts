import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaregiverDashboardComponent } from './components/caregiver-dashboard/caregiver-dashboard.component';
import { CaregiverPatientsComponent } from './components/caregiver-patients/caregiver-patients.component';
import { PatientEditComponent } from './components/patient-edit/patient-edit.component';
import { CaregiverDashboardService } from '../../services/caregiver-dashboard.service';
import { CaregiverProfileComponent } from './components/caregiver-profile/caregiver-profile.component';
import { CaregiverAvailabilityComponent } from './components/caregiver-availability/caregiver-availability.component';
import { CaregiverAppointmentsComponent } from './components/caregiver-appointments/caregiver-appointments.component';

const routes: Routes = [
  { path: '', component: CaregiverDashboardComponent },
  { path: 'patients', component: CaregiverPatientsComponent },
  { path: 'appointments', component: CaregiverAppointmentsComponent },
  { path: 'profile', component: CaregiverProfileComponent },
  { path: 'patients/edit/:id', component: PatientEditComponent }
];

@NgModule({
  declarations: [
    CaregiverDashboardComponent,
    CaregiverPatientsComponent,
    PatientEditComponent,
    CaregiverProfileComponent,
    CaregiverAvailabilityComponent,
    CaregiverAppointmentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [CaregiverDashboardService]
})
export class CaregiverModule { } 