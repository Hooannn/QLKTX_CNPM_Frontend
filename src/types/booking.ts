import { IUser, Room } from ".";

export interface BookingTime {
  id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  open: boolean;
  staff: IUser;
}

export interface Booking {
  id: number;
  booking_time: BookingTime;
  room: Room;
  student: IUser;
  status: RequestStatus;
  staff: IUser;
  created_at: string;
  checked_out_at?: string;
}

export interface BookingRequest {
  id: number;
  booking_time: BookingTime;
  room: Room;
  student: IUser;
  status: RequestStatus;
  staff: IUser;
  created_at: string;
  reject_reason?: string;
  processed_at?: string;
  booking?: Booking;
}

export enum RequestStatus {
  WAITING = "WAITING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}
