export interface User {
  userId: number;
  name: string;
  role: 'Patient' | 'Provider' | 'Admin';
  emailAddress: string;
  phoneNumber?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}