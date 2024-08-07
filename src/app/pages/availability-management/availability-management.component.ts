import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../../services/availability.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Availability } from '../../models/availability.model';
import { AvailabilityDialog } from "./availability-dialog.component";

@Component({
  selector: 'app-availability-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AvailabilityDialog
  ],
  templateUrl: './availability-management.component.html',
  styleUrl: './availability-management.component.scss'
})
export class AvailabilityManagementComponent implements OnInit {
  currentUser: any;
  currentMonth: Date = new Date();
  availability: { [date: string]: Availability[] } = {};
  selectedDate!: string;

  constructor(private authService: AuthService, private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onDateClick(date: Date | null): void {
    if (!date) return;
    this.selectedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    this.availabilityService.getAvailabilityByDate(this.selectedDate, this.currentUser.providerId).subscribe(data => {
      this.availability[this.selectedDate] = data;
    });
  }

  changeMonth(offset: number): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + offset);
    this.currentMonth = new Date(this.currentMonth); // Ensure the date object is updated
  }

  getWeeksInMonth(date: Date): { date: Date | null, isPlaceholder: boolean }[][] {
    const weeks: { date: Date | null, isPlaceholder: boolean }[][] = [];
    let currentWeek: { date: Date | null, isPlaceholder: boolean }[] = [];
    let currentDate = new Date(date.getFullYear(), date.getMonth(), 1);

    // Fill initial placeholders for the first week
    for (let i = 0; i < currentDate.getDay(); i++) {
      currentWeek.push({ date: null, isPlaceholder: true });
    }

    while (currentDate.getMonth() === date.getMonth()) {
      currentWeek.push({ date: new Date(currentDate), isPlaceholder: false });
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining placeholders for the last week
    if (currentWeek.length) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: null, isPlaceholder: true });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }

  handleUpdate(event: { date: string; timeSlots: string[] }) {
    this.availabilityService.updateAvailability(event.date, this.currentUser.providerId, event.timeSlots)
      .subscribe(
        response => {
          console.log('Availability updated successfully:', response);
        },
        error => {
          console.error('Error updating availability:', error);
        }
      );
  }

  closePopup(): void {
    this.selectedDate = "";
  }
}