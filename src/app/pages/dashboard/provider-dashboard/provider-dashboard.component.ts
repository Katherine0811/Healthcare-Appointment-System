import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AppointmentDTO } from '../../../models/appointment-dto.model';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'provider-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.scss'
})

export class ProviderDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: AppointmentDTO[] = [];
  selectedPatientRecords: any;
  upcomingErrorMessage: string | null = null;
  recordsErrorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private router: Router
  ) {}

  errorMessage: string | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.fetchUpcomingAppointments();
  }

  fetchUpcomingAppointments(): void {
    const providerId = this.currentUser.providerId;
    this.appointmentService.getUpcomingAppointmentsByProvider(providerId).subscribe(
      (data: AppointmentDTO[]) => {
        this.upcomingAppointments = data;
      },
      error => {
        this.upcomingErrorMessage = 'Error fetching upcoming appointments. Please try again later.';
        console.error('Error fetching upcoming appointments', error);
      }
    );
  }

  completeAppointment(appointmentId: number): void {
    this.appointmentService.completeAppointment(appointmentId).subscribe(
      () => {
        console.log('Appointment completed successfully');
        this.fetchUpcomingAppointments();
      },
      error => {
        console.error('Error completing appointment', error);
        this.upcomingErrorMessage = 'An error occurred while completing the appointment. Please try again later.';
      }
    );
  }

  viewPatientRecords(patientId: number): void {
    this.patientService.getPatientRecords(patientId).subscribe(
      (records: any[]) => {
        this.selectedPatientRecords = records;
      },
      error => {
        console.error('Error fetching patient records', error);
        this.recordsErrorMessage = 'An error occurred while fetching patient records. Please try again later.';
      }
    );
  }

  openUpdateModal(): void {
    this.router.navigate(['/update-profile']);
  }

  deleteAccount(): void {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      this.authService.deleteUserAccount(this.currentUser.userId).subscribe(
        () => {
          console.log('Account deleted successfully');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error deleting account', error);
          this.errorMessage = 'Error deleting account' + (error.error.message || 'Unknown error');
        }
      );
    }
  }
}