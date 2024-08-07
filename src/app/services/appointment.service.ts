import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppointmentDTO } from '../models/appointment-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) {}

  getUpcomingAppointments(patientId: number): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/upcoming/${patientId}`).pipe(
      catchError(this.handleError)
    );
  }
  
  getUpcomingAppointmentsByProvider(providerId: number): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/upcoming/provider/${providerId}`).pipe(
      catchError(this.handleError)
    );
  }

  getPastAppointments(patientId: number): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/past/${patientId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error: ${error.error}`;
    }
    return throwError(errorMessage);
  }

  bookAppointment(appointmentDetails: any): Observable<AppointmentDTO> {
    return this.http.post<AppointmentDTO>(`${this.apiUrl}/book`, appointmentDetails);
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancel/${appointmentId}`);
  }

  rescheduleAppointment(appointmentId: number, newDetails: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.put<AppointmentDTO>(`${this.apiUrl}/reschedule/${appointmentId}`, newDetails);
  }

  completeAppointment(appointmentId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/complete/${appointmentId}`, {});
  }
}
