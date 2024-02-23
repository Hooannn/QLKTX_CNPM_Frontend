import { Booking } from ".";

export interface RoomType {
  id: number;
  name: string;
  capacity: number;
  price: number;
}

export interface Region {
  id: string;
  name: string;
  rooms: Room[];
  sex: "MALE" | "FEMALE" | "OTHER";
}

export interface Room {
  id: string;
  region: Region;
  type: RoomType;
  status: RoomStatus;
  booking_count?: number;
  bookings?: Booking[];
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  MAINTAINING = "MAINTAINING",
  UNAVAILABLE = "UNAVAILABLE",
}
