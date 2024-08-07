import { User } from './user.model';
import { Appointment } from './appointment.model';

export interface Notification {
  notificationId: number;
  userId: number;
  appointmentId?: number;
  notificationType: string;
  notificationStatus: 'Pending' | 'Sent' | 'Failed';
  createdAt: string;
  updatedAt: string;
  user?: User;  // Optional relationship to the User model
  appointment?: Appointment;  // Optional relationship to the Appointment model
}
