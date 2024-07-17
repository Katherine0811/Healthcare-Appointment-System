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
  private subscription!: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.setDashboardRoute();
    });
  }

  setDashboardRoute(): void {
    if (this.currentUser) {
      if (this.currentUser.role === 'Patient') {
        this.dashboardRoute = '/patient-dashboard';
      } else {
        this.dashboardRoute = '/provider-dashboard';
      }
    } else {
      this.dashboardRoute = '/login';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
