export interface MarthaResponse<T> {
  success: boolean;
  data: T[];
}

export interface HousingLocationInfo {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  available_units: number; 
  wifi: number | boolean; 
  laundry: number | boolean;
}
