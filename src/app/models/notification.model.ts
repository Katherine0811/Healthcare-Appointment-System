import { User } from './user.model';
import { Appointment } from './appointment.model';

export interface Notification {
  notification_id: number;
  user_id: number;
  appointment_id?: number;
  notification_type: string;
  notification_status: 'Pending' | 'Sent' | 'Failed';
  created_at: string;
  updated_at: string;
  user?: User;  // Optional relationship to the User model
  appointment?: Appointment;  // Optional relationship to the Appointment model
}
