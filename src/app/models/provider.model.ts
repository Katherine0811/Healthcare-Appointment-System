import { User } from './user.model';

export interface Provider {
  providerId: number;
  userId: number;
  user?: User;  // Optional relationship to the User model
  specialization?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}
