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
  created_at: string;
  checked_out_at?: string;
  discount?: Discount;
  checkin_staff: IUser;
  checkout_staff?: IUser;
}

export interface Discount {
  id: string;
  percentage: number;
  description: string;
  start_date: string;
  end_date: string;
  staff: IUser;
}

export interface Invoice {
  id: number;
  booking: Booking;
  created_at: string;
  total: number;
  paid_at?: string;
  staff: IUser;
}
