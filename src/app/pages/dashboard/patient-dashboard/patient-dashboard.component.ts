import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentDTO } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AvailabilityService } from '../../../services/availability.service';
import { Availability } from '../../../models/availability.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'patient-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
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

  // New properties for rescheduling
  editingAppointmentId: number | null = null;
  newDate: string = '';
  newTime: string = '';

  constructor(
    private authService: AuthService, 
    private appointmentService: AppointmentService,
    private availabilityService: AvailabilityService,
    private providerService: ProviderService,
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
        // Sort by date in ascending order (earliest to latest)
        this.upcomingAppointments = data.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
      },
      error => {
        this.upcomingErrorMessage = 'There is no upcoming appointments. Please try again later.';
        console.error('Error fetching upcoming appointments', error);
      }
    );
  }

  fetchPastAppointments(): void {
    const patientId = this.currentUser.patientId;
    this.appointmentService.getPastAppointments(patientId).subscribe(
      (data: AppointmentDTO[]) => {
        // Sort by date in descending order (latest to earliest)
        this.pastAppointments = data.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      },
      error => {
        this.pastErrorMessage = 'There is no past appointments. Please try again later.';
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
        // Refresh the list of upcoming and past appointments
        this.upcomingAppointments = [];
        this.fetchUpcomingAppointments();
        this.pastAppointments = [];
        this.fetchPastAppointments();
      }),
      catchError(error => {
        console.error('Error handling appointment cancellation:', error);
        this.upcomingErrorMessage = 'An error occurred while canceling the appointment. Please try again later.';
        return of(null); // Return a fallback observable
      })
    ).subscribe();
  }

  rescheduleAppointment(appointment: AppointmentDTO, newDate: string, newTime: string): void {
    const oldDate = appointment.appointmentDate;
    const oldTime = appointment.appointmentTime;
    const providerId = appointment.providerId;

    this.appointmentService.rescheduleAppointment(appointment.appointmentId, newDate, newTime).pipe(
      tap(() => console.log('Appointment rescheduled successfully')),
      switchMap(() => 
        this.availabilityService.getAvailabilityByDate(oldDate, providerId).pipe(
          tap((availabilityData: Availability[]) => {
            if (availabilityData && Array.isArray(availabilityData) && availabilityData.length > 0) {
              this.availableTimes = availabilityData[0]?.availableTimes ?? [];
              if (!this.availableTimes.includes(oldTime)) {
                this.availableTimes.push(oldTime);
              }
            } else {
              this.availableTimes = [oldTime];
            }
          })
        )
      ),
      switchMap(() => 
        this.availabilityService.updateAvailability(oldDate, providerId, this.availableTimes.sort())
      ),
      switchMap(() =>
        this.availabilityService.getAvailabilityByDate(newDate, providerId).pipe(
          tap((availabilityData: Availability[]) => {
            if (availabilityData && Array.isArray(availabilityData) && availabilityData.length > 0) {
              this.availableTimes = availabilityData[0]?.availableTimes ?? [];
              const newTimeIndex = this.availableTimes.indexOf(newTime);
              if (newTimeIndex > -1) {
                this.availableTimes.splice(newTimeIndex, 1);
              }
            } else {
              console.warn('No availability data found for the new date and provider.');
            }
          })
        )
      ),
      switchMap(() => 
        this.availabilityService.updateAvailability(newDate, providerId, this.availableTimes.sort())
      ),
      tap(() => {
        console.log('Availability updated successfully');
        // Refresh the list of upcoming appointments
        this.fetchUpcomingAppointments();
        this.editingAppointmentId = null;  // Reset the editing state
      }),
      catchError(error => {
        console.error('Error handling appointment rescheduling:', error);
        this.upcomingErrorMessage = 'An error occurred while rescheduling the appointment. Please try again later.';
        return of(null); // Return a fallback observable
      })
    ).subscribe();
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
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error deleting account', error);
          this.errorMessage = 'Error deleting account' + (error.error.message || 'Unknown error');
        }
      );
    }
  }

  startEditing(appointment: AppointmentDTO): void {
    this.editingAppointmentId = appointment.appointmentId;
    this.newDate = appointment.appointmentDate;
    this.newTime = appointment.appointmentTime;
    this.checkAvailability(appointment);
  }

  cancelEditing(): void {
    this.editingAppointmentId = null;
  }

  checkAvailability(appointment: AppointmentDTO): void {
    this.availabilityService.getAvailabilityByDate(this.newDate, appointment.providerId).subscribe((data: Availability[]) => {
      this.availableTimes = data[0].availableTimes;
    });
  }
}
