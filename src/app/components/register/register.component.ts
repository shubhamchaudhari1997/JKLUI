import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistrationService, RegistrationData } from '../../services/registration.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

enum UserType {
  Administrator = 0,
  Caregiver = 1,
  Patient = 2
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  userTypes = [
    { id: 0, name: 'Administrator' },
    { id: 1, name: 'Caregiver' },
    { id: 2, name: 'Patient' }
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      address: ['', Validators.required],
      userType: ['2', Validators.required],  // Default to Patient
      specialization: [{ value: '', disabled: true }]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Watch for userType changes to handle specialization field
    this.registerForm.get('userType')?.valueChanges.subscribe(value => {
      const specializationControl = this.registerForm.get('specialization');
      if (value === '1') { // Caregiver
        specializationControl?.enable();
        specializationControl?.setValidators([Validators.required]);
      } else {
        specializationControl?.disable();
        specializationControl?.clearValidators();
      }
      specializationControl?.updateValueAndValidity();
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // Helper method to check if specialization should be shown
  showSpecialization(): boolean {
    return this.registerForm.get('userType')?.value === '1';
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const formValues = this.registerForm.getRawValue();
    
    const registrationData: RegistrationData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword:formValues.confirmPassword,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      userType: parseInt(formValues.userType),
      specialization: formValues.specialization
    };

    console.log('Registration URL:', `${environment.apiUrl}/Auth/register`);
    console.log('Registration Data:', registrationData);

    this.registrationService.register(registrationData).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.toastr.error(error.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }

  // Navigate to login page
  onCancel() {
    this.router.navigate(['/login']);
  }
} 