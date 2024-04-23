import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Booking, IResponseData } from "../../types";
import { Image, Spinner } from "@nextui-org/react";
import CurrentBookingCard from "./CurrentBookingCard";

export default function CurrentBookingsTab() {
  const axios = useAxiosIns();
  const getCurrentBookingsQuery = useQuery({
    queryKey: ["fetch/my/current-bookings"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Booking[]>>(`/api/v1/booking/my-booking`);
    },
  });

  const bookings = getCurrentBookingsQuery.data?.data?.data || [];
  return (
    <>
      {getCurrentBookingsQuery.isLoading ? (
        <div className="w-full text-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {bookings.length > 0 ? (
            <div className="w-full flex flex-wrap gap-2">
              {bookings.map((booking) => (
                <CurrentBookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full flex flex-col items-center py-12 gap-4">
                <Image src="/Empty.svg" width={200} />
                <small>Bạn hiện tại chưa thuê phòng nào.</small>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
