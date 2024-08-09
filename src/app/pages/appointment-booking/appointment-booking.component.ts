import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AvailabilityService } from '../../services/availability.service';
import { ProviderService } from '../../services/provider.service';
import { AuthService } from '../../services/auth.service';
import { Availability } from '../../models/availability.model';
@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.scss'
})

export class AppointmentBookingComponent implements OnInit {
  currentUser: any;
  appointmentForm: FormGroup;
  errorMessage: string | null = null;
  doctors: string[] = [];
  selectedProvider!: string;
  selectedProviderId!: number;
  selectedDate!: string;
  availableTimes: string[] = [];
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private providerService: ProviderService,
    private availabilityService: AvailabilityService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      providerName: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.minDate = new Date().toISOString().split('T')[0];
    this.loadProviders();
  }

  loadProviders(): void {
    this.providerService.getProviderList().subscribe((data: string[]) => {
      this.doctors = data;
    });
  }

  onDoctorChange(): void {
    this.selectedProvider = this.appointmentForm.get('providerName')?.value;
    this.checkAvailability();
  }

  onDateChange(): void {
    this.selectedDate = this.appointmentForm.get('appointmentDate')?.value;
    this.checkAvailability();
  }

  checkAvailability(): void {
    if (this.selectedProvider && this.selectedDate) {
      this.providerService.getProviderByName(this.selectedProvider).subscribe((providerData: any) => {
        if (providerData.providerId) {          
          this.selectedProviderId = providerData.providerId;
          this.availabilityService.getAvailabilityByDate(this.selectedDate, providerData.providerId).subscribe((data: Availability[]) => {
            this.availableTimes = data[0].availableTimes;
          });
        } else {
          console.error('Provider ID is undefined');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointmentDetails = {
        providerId: this.selectedProviderId,
        patientId: this.currentUser.patientId,
        appointmentDate: this.appointmentForm.get('appointmentDate')?.value,
        appointmentTime: this.appointmentForm.get('appointmentTime')?.value
      };
      console.log(appointmentDetails);
      this.appointmentService.bookAppointment(appointmentDetails).subscribe(
        response => {
          console.log('Appointment booked successfully', response);

          // Exclude the appointment time from the list of available times
          const bookedTime = this.appointmentForm.get('appointmentTime')?.value;
          this.availableTimes = this.availableTimes.filter(time => time !== bookedTime);
          console.log(this.availableTimes);

          this.availabilityService.updateAvailability(this.selectedDate, this.selectedProviderId, this.availableTimes)
            .subscribe(
              response => {
                console.log('Availability updated successfully:', response);
              },
              error => {
                console.error('Error updating availability:', error);
              }
            );
          this.router.navigate(['/patient-dashboard']);
        },
        error => {
          console.error('Error booking appointment', error);
          this.errorMessage = 'Error booking appointment: ' + (error.error.message || 'Unknown error');
        }
      );
    }
  }
}