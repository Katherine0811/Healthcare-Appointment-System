import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentDTO } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AvailabilityService } from '../../../services/availability.service';
import { Availability } from '../../../models/availability.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'patient-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  currentUser: any;
  availableTimes: string[] = [];
  upcomingAppointments: AppointmentDTO[] = [];
  pastAppointments: AppointmentDTO[] = [];
  upcomingErrorMessage: string | null = null;
  pastErrorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private appointmentService: AppointmentService,
    private availabilityService: AvailabilityService,
    private router: Router
  ) {}

  errorMessage: string | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.fetchUpcomingAppointments();
    this.fetchPastAppointments();
  }

  fetchUpcomingAppointments(): void {
    const patientId = this.currentUser.patientId;
    this.appointmentService.getUpcomingAppointments(patientId).subscribe(
      (data: AppointmentDTO[]) => {
        this.upcomingAppointments = data;
      },
      error => {
        this.upcomingErrorMessage = 'Error fetching upcoming appointments. Please try again later.';
        console.error('Error fetching upcoming appointments', error);
      }
    );
  }

  fetchPastAppointments(): void {
    const patientId = this.currentUser.patientId;
    this.appointmentService.getPastAppointments(patientId).subscribe(
      (data: AppointmentDTO[]) => {
        this.pastAppointments = data;
      },
      error => {
        this.pastErrorMessage = 'Error fetching past appointments. Please try again later.';
        console.error('Error fetching past appointments', error);
      }
    );
  }

  async cancelAppointment(appointment: AppointmentDTO): Promise<void> {
    this.appointmentService.cancelAppointment(appointment.appointmentId).pipe(
      tap(() => console.log('Appointment cancelled successfully')),
      switchMap(() => 
        this.availabilityService.getAvailabilityByDate(appointment.appointmentDate, appointment.providerId).pipe(
          tap((availabilityData: Availability[]) => {
            if (availabilityData && Array.isArray(availabilityData) && availabilityData.length > 0) {
              this.availableTimes = availabilityData[0]?.availableTimes ?? [];
            } else {
              this.availableTimes = [];
              console.warn('No availability data found for the given date and provider.');
            }
          })
        )
      ),
      tap(() => {
        // Add the cancelled appointment time back to available times
        if (!this.availableTimes.includes(appointment.appointmentTime)) {
          this.availableTimes.push(appointment.appointmentTime);
          console.log('Updated available times:', this.availableTimes);
        }
      }),
      switchMap(() => 
        this.availabilityService.updateAvailability(appointment.appointmentDate, appointment.providerId, this.availableTimes.sort())
      ),
    tap(() => {
      console.log('Availability updated successfully');
      // Refresh the list of upcoming appointments
      this.fetchUpcomingAppointments();
    }),
    catchError(error => {
      console.error('Error handling appointment cancellation:', error);
      this.upcomingErrorMessage = 'An error occurred while canceling the appointment. Please try again later.';
      return of(null); // Return a fallback observable
    })
  ).subscribe();
  }

  rescheduleAppointment(appointmentId: number, newDetails: any): void {
    this.appointmentService.rescheduleAppointment(appointmentId, newDetails).subscribe(
      (response: AppointmentDTO) => {
        console.log('Appointment rescheduled successfully', response);
        this.fetchUpcomingAppointments();
      },
      error => {
        console.error('Error rescheduling appointment', error);
        this.upcomingErrorMessage = 'An error occurred while rescheduling the appointment. Please try again later.';
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
