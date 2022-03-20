export type ShipData = {
  active: boolean;
  id: string;
  image: string;
  name: string;
  roles: string[];
  type: availableTypes;
}

export type availableTypes = 'High Speed Craft' | 'Cargo' | 'Tug' | 'Barge';