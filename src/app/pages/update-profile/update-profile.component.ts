import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {
  form!: FormGroup;
  currentUser!: any;
  isPatient: boolean = false;
  isProvider: boolean = false;
  maxDate: string = '';
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isPatient = this.currentUser.role === 'Patient';
    this.isProvider = this.currentUser.role === 'Provider';
    this.maxDate = new Date().toISOString().split('T')[0];

    this.form = this.formBuilder.group({
      name: [this.currentUser.name, Validators.required],
      emailAddress: [this.currentUser.emailAddress, [Validators.required, Validators.email]],
      phoneNumber: [this.currentUser.phoneNumber, [Validators.required, Validators.pattern(/^\+353\d{8,}$/)]],
      role: [this.currentUser.role, Validators.required],
      dateOfBirth: [this.currentUser.dateOfBirth || ''],
      gender: [this.currentUser.gender || ''],
      homeAddress: [this.currentUser.homeAddress || ''],
      insuranceNumber: [this.currentUser.insuranceNumber || ''],
      specialization: [this.currentUser.specialization || ''],
      licenseNumber: [this.currentUser.licenseNumber || '']
    });
  }

  onRoleChange(event: any): void {
    const role = event.target.value;
    this.isPatient = role === 'Patient';
    this.isProvider = role === 'Provider';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log("invalid form");
      return;
    }

    const updatedData = this.form.value;
    this.authService.updateUserDetails(this.currentUser.userId, updatedData).subscribe(
      response => {
        this.authService.setCurrentUser(response);
        console.log('User updated successfully', response);
        if (this.isPatient) {
          this.router.navigate(['/patient-dashboard']);
        } else if (this.isProvider) {
          this.router.navigate(['/provider-dashboard']);
        }
      },
      error => {
        console.error('Error updating user', error);
        this.errorMessage = 'An error occurred while updating the profile. Please try again later.';
      }
    );
  }

  onCancel(): void {
    if (this.isPatient) {
      this.router.navigate(['/patient-dashboard']);
    } else if (this.isProvider) {
      this.router.navigate(['/provider-dashboard']);
    }
  }
}
