import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability } from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:8080/availability';

  constructor(private http: HttpClient) {}

  getAvailabilityByDate(date: string, providerId: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/date?date=${date}&providerId=${providerId}`);
  }

  updateAvailability(date: string, providerId: number, timeSlots: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update?date=${date}&providerId=${providerId}`, timeSlots);
  }
}
