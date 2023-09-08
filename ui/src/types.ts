export enum OrderType {
  OrderA = "A",
  OrderB = "B",
  OrderC = "C",
  Unknown = "Unknown",
}

export enum RoomStatus {
  recentlyOccupied = 'recentlyOccupied',
  ecoMode = 'ecoMode',
  readyForPickup = 'readyForPickup',
  pickupCompleted = 'pickupCompleted',
}

export type ShipStatus = Record<RoomStatus, Record<OrderType | 'total', { count: number, value: number}>>;
