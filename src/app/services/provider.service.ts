import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'http://localhost:8080/providers';

  constructor(private http: HttpClient) { }

  getProviderList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }

  getProviderByName(name: string): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/name?name=${name}`);
  }
}
