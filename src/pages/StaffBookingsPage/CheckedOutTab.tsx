import { Booking } from "../../types/booking";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Room } from "../../types";
import BookingsTable from "./BookingsTable";

export default function CheckedOutTab({ room }: { room?: Room }) {
  const axios = useAxiosIns();

  const bookingsQuery = {
    queryKey: ["fetch/checkedOutBookings"],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>("/api/v1/booking/checked-out"),
    refetchOnWindowFocus: false,
  };

  const roomBookingsQuery = {
    queryKey: ["fetch/checkedOutBookings/roomId", room?.id],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>(
        `/api/v1/booking/room/${room?.id}/checked-out`
      ),
    refetchOnWindowFocus: false,
  };

  const getBookingsQuery = useQuery(room ? roomBookingsQuery : bookingsQuery);

  const bookings = getBookingsQuery.data?.data?.data || [];
  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Phiếu thuê đã trả</div>
          <div className="flex gap-4"></div>
        </div>

        <BookingsTable
          bookings={bookings}
          isLoading={getBookingsQuery.isLoading}
        />
      </div>
    </>
  );
}
