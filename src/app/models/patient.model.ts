import { User } from './user.model';

export interface Patient {
  patientId: number;
  userId: number;
  user?: User;  // Optional relationship to the User model
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  homeAddress?: string;
  insuranceNumber?: string;
  createdAt: string;
  updatedAt: string;
}
