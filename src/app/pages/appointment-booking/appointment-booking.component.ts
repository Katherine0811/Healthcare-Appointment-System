import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Provider } from '../../models/provider.model'
import { AppointmentDTO } from '../../models/appointment-dto.model';
@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.scss'
})

export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;
  doctors: Provider[] = [];
  filteredDoctors: Provider[] = [];
  availableTimes: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.formBuilder.group({
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    // this.loadDoctors();
  }

  

  bookAppointment(appointmentDetails: any): void {
    this.appointmentService.bookAppointment(appointmentDetails).subscribe((response: AppointmentDTO) => {
      console.log('Appointment booked successfully', response);
    });
  }

  onSubmit() {
  //   if (this.appointmentForm.valid) {
  //     const appointment: Appointment = {
  //       doctorId: this.appointmentForm.value.doctor,
  //       date: this.appointmentForm.value.date,
  //       time: this.appointmentForm.value.time
  //     };
      
  //     // Call your service to book appointment
  //     this.appointmentService.bookAppointment(appointment).subscribe(
  //       response => {
  //         console.log('Appointment booked successfully!');
  //         // Optionally, navigate to a success page or display a confirmation message
  //       },
  //       error => {
  //         console.error('Failed to book appointment:', error);
  //         // Handle error appropriately, e.g., display error message
  //       }
  //     );
  //   }
  }
}