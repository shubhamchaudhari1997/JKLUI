import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CaregiversListComponent } from './caregivers-list/caregivers-list.component';
import { CaregiverService } from '../../../services/caregiver.service';

const routes: Routes = [
  {
    path: '',
    component: CaregiversListComponent
  }
];

@NgModule({
  declarations: [
    CaregiversListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [CaregiverService]
})
export class CaregiversModule { } 