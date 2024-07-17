import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for NgIf
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  dashboardRoute: string | null = null;
  private subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
