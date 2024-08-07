import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentUser: any;
  dashboardRoute: string | null = null;
  functionRoute: string | null = null;
  functionName: string | null = null;
  private subscription!: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.setRoute();
    });
  }

  setRoute(): void {
    if (this.currentUser) {
      if (this.currentUser.role === 'Patient') {
        this.dashboardRoute = '/patient-dashboard';
        this.functionRoute = '/appointment-booking';
        this.functionName = "Appointment Booking";
      } else {
        this.dashboardRoute = '/provider-dashboard';
        this.functionRoute = '/availability-management';
        this.functionName = "Availability Management";
      }
    } else {
      this.dashboardRoute = '/login';
      this.functionRoute = '/about';
      this.functionName = "About Us";
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
