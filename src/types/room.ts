export interface RoomType {
  id: number;
  name: string;
  capacity: number;
  price: number;
}

export interface Region {
  id: string;
  rooms: Room[];
  name: string;
  sex: "MALE" | "FEMALE" | "OTHER";
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
