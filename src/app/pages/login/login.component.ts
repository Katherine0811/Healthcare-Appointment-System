import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule for NgIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  form!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit() {
    this.form = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]] // Password validation
    });
  }
  
  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.login(this.f['emailAddress'].value, this.f['password'].value).subscribe(
      response => {
        console.log('Login successful', response);
        this.authService.setCurrentUser(response);
        if (response.role === 'Patient') {
          this.router.navigate(['/patient-dashboard']);
        } else if (response.role === 'Provider') {
          this.router.navigate(['/provider-dashboard']);
        }
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed: ' + (error.error.message || 'Unknown error');
      }
    );
  }
}
