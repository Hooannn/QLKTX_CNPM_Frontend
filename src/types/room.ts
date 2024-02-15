export interface RoomType {
  id: number;
  name: string;
  capacity: number;
  price: number;
  sex: "MALE" | "FEMALE" | "OTHER";
}

export interface Region {
  id: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  region: Region;
  type: RoomType;
  status: RoomStatus;
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  MAINTAINING = "MAINTAINING",
  UNAVAILABLE = "UNAVAILABLE",
}
