import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { PatientAppointmentsComponent } from './components/patient-appointments/patient-appointments.component';
import { AppointmentService } from '../../services/appointment.service';

const routes: Routes = [
  { path: '', component: PatientDashboardComponent },
  { path: 'profile', component: PatientProfileComponent },
  { path: 'appointments', component: PatientAppointmentsComponent }
];

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientProfileComponent,
    PatientAppointmentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AppointmentService
  ]
})
export class PatientModule { } 