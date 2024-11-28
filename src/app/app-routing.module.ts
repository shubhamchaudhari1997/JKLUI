import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [0] }
  },
  {
    path: 'patients',
    loadChildren: () => import('./modules/admin/patients/patients.module').then(m => m.PatientsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [0] }
  },
  {
    path: 'caregivers',
    loadChildren: () => import('./modules/admin/caregivers/caregivers.module').then(m => m.CaregiversModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [0] }
  },
  {
    path: 'caregiver',
    loadChildren: () => import('./modules/caregiver/caregiver.module').then(m => m.CaregiverModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1] }
  },
  {
    path: 'patient',
    loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
