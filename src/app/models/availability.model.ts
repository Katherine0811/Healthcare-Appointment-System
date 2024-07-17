import { Provider } from './provider.model';

export interface Availability {
  availability_id: number;
  provider_id: number;
  available_date: string;
  available_time: string;
  created_at: string;
  updated_at: string;
  provider?: Provider;  // Optional relationship to the Provider model
}
