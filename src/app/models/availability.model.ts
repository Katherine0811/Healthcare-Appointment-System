import { Provider } from './provider.model';

export interface Availability {
  availabilityId: number;
  providerId: number;
  availableDate: string;
  availableTimes: string[];
  createdAt: string;
  updatedAt: string;
  provider?: Provider;  // Optional relationship to the Provider model
}
