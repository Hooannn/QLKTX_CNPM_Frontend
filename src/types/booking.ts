import { IUser } from ".";

export interface BookingTime {
  id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  open: boolean;
  staff: IUser;
}
