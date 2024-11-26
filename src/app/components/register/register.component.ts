import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistrationService, RegistrationData } from '../../services/registration.service';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthResponse } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';

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
  submitted = false;
  errorMessage: string = '';

  userTypes = [
    { id: 0, name: 'Administrator' },
    { id: 1, name: 'Caregiver' },
    { id: 2, name: 'Patient' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      userType: [2, Validators.required],
      specialization: [{value: '', disabled: true}],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });

    // Subscribe to userType changes to handle specialization field
    this.registerForm.get('userType')?.valueChanges.subscribe(value => {
      console.log('UserType changed to:', value); // Debug log
      const specializationControl = this.registerForm.get('specialization');
      if (Number(value) === UserType.Caregiver) { // Convert value to number and compare
        console.log('Enabling specialization field'); // Debug log
        specializationControl?.enable();
        specializationControl?.setValidators([Validators.required]);
      } else {
        console.log('Disabling specialization field'); // Debug log
        specializationControl?.disable();
        specializationControl?.clearValidators();
        specializationControl?.setValue('');
      }
      specializationControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    // Initialize specialization state based on initial userType
    const userType = this.registerForm.get('userType')?.value;
    const specializationControl = this.registerForm.get('specialization');
    if (Number(userType) === UserType.Caregiver) { // Convert value to number and compare
      specializationControl?.enable();
      specializationControl?.setValidators([Validators.required]);
    } else {
      specializationControl?.disable();
      specializationControl?.clearValidators();
    }
    specializationControl?.updateValueAndValidity();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  get f() { return this.registerForm.controls; }

  showSpecialization(): boolean {
    return Number(this.registerForm.get('userType')?.value) === UserType.Caregiver; // Convert value to number and compare
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const formValues = this.registerForm.getRawValue();
    const registrationData: RegistrationData = {
      ...formValues,
      userType: Number(formValues.userType),
      isActive: true,
      createdAt: new Date()
    };

    this.registrationService.register(registrationData)
      .pipe(
        tap(response => {
          debugger;
          console.log('Registration API Response:', response);
        }),
        catchError(error => {
          debugger;
          console.error('Registration API Error:', error);
          
          if (error.error instanceof ErrorEvent) {
            this.toastr.error('An error occurred: ' + error.error.message);
          } else {
            if (error.error?.errors) {
              this.toastr.error(Object.values(error.error.errors).join('\n'));
            } else if (error.error?.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }
          }
          return of(null);
        })
      )
      .subscribe((response: AuthResponse | null) => {
        debugger;
        if (response && response.isSuccess) {
          console.log('Registration successful:', response);
          
          // Show success message using toastr
          this.toastr.success('Registration successful! Please login with your credentials.', 'Success');
          
          // Clear the form
          this.registerForm.reset();
          this.submitted = false;
          
          // Navigate to login page after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else if (response) {
          console.log('Registration failed:', response);
          this.toastr.error(response.message || 'Registration failed. Please try again.');
        }
      });
  }
} 