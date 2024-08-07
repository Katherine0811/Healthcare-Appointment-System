import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/patients';
  constructor(private http: HttpClient) { }

  getPatientRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${patientId}`);
  }
}
