export type UtilityType = 'water' | 'electricity' | 'heating' | 'gas' | 'internet';

export interface UtilityOutage {
  id: string;
  type: UtilityType;
  status: 'active' | 'scheduled' | 'resolved';
  startTime: Date;
  endTime: Date | null;
  address: string;
  district: string;
  description: string;
  affectedHouses?: number;
  source: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface District {
  id: string;
  name: string;
  active: boolean;
}
