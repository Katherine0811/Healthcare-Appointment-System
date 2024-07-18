import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'patient-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})

export class PatientDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: any[] = [];
  pastAppointments: any[] = [];

  constructor(private authService: AuthService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Fetch patient specific data
    this.fetchUpcomingAppointments();
    this.fetchPastAppointments();
  }

  fetchUpcomingAppointments(): void {
    this.appointmentService.getUpcomingAppointments().subscribe((data: any) => {
      this.upcomingAppointments = data;
    });
  }

  fetchPastAppointments(): void {
    this.appointmentService.getPastAppointments().subscribe((data: any) => {
      this.pastAppointments = data;
    });
  }

  bookAppointment(appointmentDetails: any): void {
    this.appointmentService.bookAppointment(appointmentDetails).subscribe((response: any) => {
      console.log('Appointment booked successfully', response);
      this.fetchUpcomingAppointments(); // Refresh the upcoming appointments list
    });
  }

  cancelAppointment(appointmentId: number): void {
    this.appointmentService.cancelAppointment(appointmentId).subscribe((response: any) => {
      console.log('Appointment cancelled successfully', response);
      this.fetchUpcomingAppointments(); // Refresh the upcoming appointments list
    });
  }

  rescheduleAppointment(appointmentId: number, newDetails: any): void {
    this.appointmentService.rescheduleAppointment(appointmentId, newDetails).subscribe((response: any) => {
      console.log('Appointment rescheduled successfully', response);
      this.fetchUpcomingAppointments(); // Refresh the upcoming appointments list
    });
  }
}
