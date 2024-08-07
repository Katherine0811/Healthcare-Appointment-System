import { Patient } from './patient.model';
import { Provider } from './provider.model';

export interface Appointment {
  appointmentId: number;
  patientId: number;
  providerId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  patient?: Patient;  // Optional relationship to the Patient model
  provider?: Provider;  // Optional relationship to the Provider model
}
