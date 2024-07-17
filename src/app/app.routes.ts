import { Routes } from '@angular/router';

// Import page components
import { HomeComponent } from './pages/home/home.component';
import { PatientDashboardComponent } from './pages/dashboard/patient-dashboard/patient-dashboard.component';
import { ProviderDashboardComponent } from './pages/dashboard/provider-dashboard/provider-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AppointmentBookingComponent } from './pages/appointment-booking/appointment-booking.component';
import { AuthGuard } from './helpers/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard] },
  { path: 'provider-dashboard', component: ProviderDashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'appointment-booking', component: AppointmentBookingComponent },
  { path: '**', redirectTo: '' }
  // Additional routes can be added here
];