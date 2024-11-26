import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaregiverService, CaregiverUpdateDto } from '../../../../services/caregiver.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caregiver-profile',
  templateUrl: './caregiver-profile.component.html',
  styleUrls: ['./caregiver-profile.component.scss']
})
export class CaregiverProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  originalProfile: any = null;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private caregiverService: CaregiverService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      Name: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      Specialization: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Address: ['']
    });

    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      this.userEmail = parsedAuthData.email;
    }
  }

  ngOnInit() {
    this.loading = true;
    const authData = localStorage.getItem('authData');
    if (!authData) {
      this.toastr.error('Session expired. Please login again.');
      return;
    }

    const userId = JSON.parse(authData).userId;
    this.caregiverService.getCaregiverDetails(userId).subscribe({
      next: (profile) => {
        debugger;
        this.originalProfile = profile;
        this.profileForm.patchValue({
          Name: profile.name,
          email: this.userEmail,
          Specialization: profile.specialization,
          PhoneNumber: profile.phoneNumber || '',
          Address: profile.address || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.toastr.error('Failed to load profile data');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    const formValues = this.profileForm.getRawValue();
    
    const updateRequest: CaregiverUpdateDto = {
      Name: formValues.Name,
      Specialization: formValues.Specialization,
      PhoneNumber: formValues.PhoneNumber,
      Address: formValues.Address
    };

    console.log('Submitting profile update:', updateRequest);
    debugger;

    this.caregiverService.updateCaregiverProfile(updateRequest).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.toastr.success('Profile updated successfully');
        this.originalProfile = {
          ...this.originalProfile,
          name: updateRequest.Name,
          specialization: updateRequest.Specialization,
          phoneNumber: updateRequest.PhoneNumber,
          address: updateRequest.Address
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toastr.error('Failed to update profile');
        this.loading = false;
      }
    });
  }

  hasChanges(): boolean {
    if (!this.originalProfile) return false;
    
    const currentValues = this.profileForm.getRawValue();
    return currentValues.Name !== this.originalProfile.name ||
           currentValues.Specialization !== this.originalProfile.specialization ||
           currentValues.PhoneNumber !== this.originalProfile.phoneNumber ||
           currentValues.Address !== this.originalProfile.address;
  }
} 