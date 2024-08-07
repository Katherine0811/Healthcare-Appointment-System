import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/users';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getCurrentUserFromLocalStorage(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  login(emailAddress: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { emailAddress, password }).pipe(
      catchError(this.handleError)
    );
  }

  register(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, form).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    return throwError(error);
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(
      () => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user); // Update the BehaviorSubject
  }

  updateUserDetails(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.userId}`, user);
  }

  deleteUserAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
