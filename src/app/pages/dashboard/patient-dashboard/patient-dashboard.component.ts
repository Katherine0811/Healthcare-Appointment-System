import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentDTO } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'patient-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: AppointmentDTO[] = [];
  pastAppointments: AppointmentDTO[] = [];

  constructor(private authService: AuthService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.fetchUpcomingAppointments();
    this.fetchPastAppointments();
  }

  fetchUpcomingAppointments(): void {
    const patientId = this.currentUser.patientId;
    this.appointmentService.getUpcomingAppointments(patientId).subscribe((data: AppointmentDTO[]) => {
      this.upcomingAppointments = data;
    });
  }

  fetchPastAppointments(): void {
    const patientId = this.currentUser.patientId;
    this.appointmentService.getPastAppointments(patientId).subscribe((data: AppointmentDTO[]) => {
      this.pastAppointments = data;
    });
  }

  cancelAppointment(appointmentId: number): void {
    this.appointmentService.cancelAppointment(appointmentId).subscribe((response: any) => {
      console.log('Appointment cancelled successfully', response);
      this.fetchUpcomingAppointments(); // Refresh the upcoming appointments list
    });
  }

  rescheduleAppointment(appointmentId: number, newDetails: any): void {
    this.appointmentService.rescheduleAppointment(appointmentId, newDetails).subscribe((response: AppointmentDTO) => {
      console.log('Appointment rescheduled successfully', response);
      this.fetchUpcomingAppointments(); // Refresh the upcoming appointments list
    });
  }
}
