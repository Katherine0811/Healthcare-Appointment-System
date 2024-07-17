export interface User {
  user_id: number;
  name: string;
  role: 'Patient' | 'Provider' | 'Admin';
  email_address: string;
  phone_number?: string;
  password: string;
  created_at: string;
  updated_at: string;
}