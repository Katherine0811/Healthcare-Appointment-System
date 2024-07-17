import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: any[] = [];
  pastAppointments: any[] = [];

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Fetch patient specific data
    // Fetch appointments (replace with actual API endpoints)
    this.fetchUpcomingAppointments();
    this.fetchPastAppointments();
  }

  fetchUpcomingAppointments(): void {
    this.http.get('/api/upcoming-appointments').subscribe((data: any) => {
      this.upcomingAppointments = data;
    });
  }

  fetchPastAppointments(): void {
    this.http.get('/api/past-appointments').subscribe((data: any) => {
      this.pastAppointments = data;
    });
  }

  bookAppointment(): void {
    // Logic to book a new appointment
  }

  cancelAppointment(appointmentId: number): void {
    // Logic to cancel an appointment
  }

  rescheduleAppointment(appointmentId: number): void {
    // Logic to reschedule an appointment
  }
}
