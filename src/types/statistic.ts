export interface StatisticOverview {
  totalRooms: number;
  totalRegions: number;
  totalMaintainingRooms: number;
  totalEmptyRooms: number;
  totalStudents: number;
  totalBookedStudents: number;
  totalInvoices: number;
  totalUnpaidInvoices: number;
  roomTypeStatistics: RoomTypeWithRoomCountView[];
}

interface RoomTypeWithRoomCountView {
  name: string;
  totalRooms: number;
}
