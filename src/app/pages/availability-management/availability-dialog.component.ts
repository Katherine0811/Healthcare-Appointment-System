import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Availability } from '../../models/availability.model';

@Component({
  selector: 'availability-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-dialog.component.html',
  styleUrl: './availability-dialog.component.scss'
})
export class AvailabilityDialog implements OnChanges {

  @Input() date!: string;
  @Input() availability: Availability[] = [];
  @Output() update = new EventEmitter<{ date: string; timeSlots: string[] }>();
  @Output() close = new EventEmitter<void>();
  
  timeSlots = ['10:00:00', '11:00:00', '14:00:00', '15:00:00']; // Default time slots
  isEditMode: boolean = false;
  selectedTimeSlots: Set<string> = new Set();

  ngOnChanges(): void {
    this.selectedTimeSlots = new Set(this.availability.flatMap(a => a.availableTimes));
    console.log(this.selectedTimeSlots);
  }

  toggleEditMode(): void {
    this.isEditMode = true;
  }

  closePopup(): void {
    this.close.emit();  // Emit the close event
  }

  onSubmit(): void {
    this.update.emit({ date: this.date, timeSlots: Array.from(this.selectedTimeSlots) });
    this.isEditMode = false;
  }

  onCancel(): void {
    this.isEditMode = false;
  }

  toggleTimeSlot(timeSlot: string): void {
    if (this.selectedTimeSlots.has(timeSlot)) {
      this.selectedTimeSlots.delete(timeSlot);
    } else {
      this.selectedTimeSlots.add(timeSlot);
    }
    this.selectedTimeSlots = new Set(Array.from(this.selectedTimeSlots).sort());
  }
}
