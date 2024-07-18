import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentDTO } from '../models/appointment-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments'; // Base URL for the API

  constructor(private http: HttpClient) {}

  getUpcomingAppointments(patientId: number): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/upcoming/${patientId}`);
  }

  getPastAppointments(patientId: number): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/past/${patientId}`);
  }

  bookAppointment(appointmentDetails: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.post<AppointmentDTO>(`${this.apiUrl}/book`, appointmentDetails);
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancel/${appointmentId}`);
  }

  rescheduleAppointment(appointmentId: number, newDetails: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.put<AppointmentDTO>(`${this.apiUrl}/reschedule/${appointmentId}`, newDetails);
  }
}
