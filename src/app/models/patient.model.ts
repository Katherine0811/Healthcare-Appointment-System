import { User } from './user.model';

export interface Patient {
  patient_id: number;
  user_id: number;
  user?: User;  // Optional relationship to the User model
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  home_address?: string;
  insurance_number?: string;
  created_at: string;
  updated_at: string;
}
