import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {
  isPatient = false;
  isProvider = false;
  maxDate: string = '';
  form!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+353\d{8,}$/)]],
      role: ['', [Validators.required]], 
      dateOfBirth: [''],
      gender: [''],
      homeAddress: [''],
      insuranceNumber: [''],
      specialization: [''],
      licenseNumber: ['']
    },
    { validator: this.passwordMatchValidator });
  }

  onRoleChange(event: any) {
    const role = event.target.value;
    this.isPatient = role === 'Patient';
    this.isProvider = role === 'Provider';
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      if (formData.role === 'Patient') {
        const patientData = {
          name: formData.name,
          role: formData.role,
          emailAddress: formData.emailAddress,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          homeAddress: formData.homeAddress,
          insuranceNumber: formData.insuranceNumber
        };
        this.authService.register(patientData).subscribe(
          response => {
            console.log('Patient Registration successful', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Patient Registration failed', error);
            this.errorMessage = 'Patient Registration failed: ' + (error.error.message || 'Unknown error');
          }
        );
      } else if (formData.role === 'Provider') {
        const providerData = {
          name: formData.name,
          role: formData.role,
          emailAddress: formData.emailAddress,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization
        };
        this.authService.register(providerData).subscribe(
          response => {
            console.log('Provider Registration successful', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Provider Registration failed', error);
            this.errorMessage = 'Provider Registration failed: ' + (error.error.message || 'Unknown error');
          }
        );
      }
    }
  }
}