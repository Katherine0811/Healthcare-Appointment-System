import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments'; // Base URL for the API

  constructor(private http: HttpClient) {}

  getUpcomingAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming`);
  }

  getPastAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/past`);
  }

  bookAppointment(appointmentDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, appointmentDetails);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cancel/${appointmentId}`);
  }

  rescheduleAppointment(appointmentId: number, newDetails: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reschedule/${appointmentId}`, newDetails);
  }
}
