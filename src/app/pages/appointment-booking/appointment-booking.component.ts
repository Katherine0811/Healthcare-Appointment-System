import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model'
import { Provider } from '../../models/provider.model'
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

  // loadDoctors() {
  //   this.appointmentService.getDoctors().subscribe((data: Provider[]) => {
  //     this.doctors = data;
  //     this.filteredDoctors = [...this.doctors];
  //   });
  // }

  // filterDoctors(event: any) {
  //   const searchTerm = event.target.value.toLowerCase();
  //   this.filteredDoctors = this.doctors.filter(
  //     doctor => doctor.name.toLowerCase().indexOf(searchTerm) !== -1
  //   );
  // }

  // fetchAvailableTimes() {
  //   const doctorId = this.appointmentForm.value.doctor;
  //   const selectedDate = this.appointmentForm.value.date;
  //   this.appointmentService
  //     .getAvailableTimes(doctorId, selectedDate)
  //     .subscribe((data: string[]) => {
  //       this.availableTimes = data;
  //     });
  // }

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