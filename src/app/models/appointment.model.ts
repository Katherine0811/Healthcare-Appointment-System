import { Patient } from './patient.model';
import { Provider } from './provider.model';

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  provider_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
  patient?: Patient;  // Optional relationship to the Patient model
  provider?: Provider;  // Optional relationship to the Provider model
}
