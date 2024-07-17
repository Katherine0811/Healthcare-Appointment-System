import { User } from './user.model';

export interface Provider {
  provider_id: number;
  user_id: number;
  user?: User;  // Optional relationship to the User model
  specialization?: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}
