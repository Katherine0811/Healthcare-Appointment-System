export interface AppointmentDTO {
  appointmentId: number;
  patientId: number;
  patientName: string;
  providerId: number;
  providerName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}