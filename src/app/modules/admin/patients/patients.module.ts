import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientService } from '../../../services/patient.service';

const routes: Routes = [
  { path: '', component: PatientsListComponent },
  { path: 'edit/:id', component: PatientEditComponent }
];

@NgModule({
  declarations: [
    PatientsListComponent,
    PatientEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [PatientService]
})
export class PatientsModule { } 