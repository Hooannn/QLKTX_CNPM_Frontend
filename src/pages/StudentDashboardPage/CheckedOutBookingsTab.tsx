import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Booking } from "../../types";
import { Image, Spinner } from "@nextui-org/react";
import BookingsTable from "../StaffBookingsPage/BookingsTable";

export default function CheckedOutBookingsTab() {
  const axios = useAxiosIns();
  const getCheckedOutBookingsQuery = useQuery({
    queryKey: ["fetch/my/checked-out-bookings"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Booking[]>>(
        `/api/v1/booking/my-lastbooking`
      );
    },
  });

  const bookings = getCheckedOutBookingsQuery.data?.data?.data || [];
  return (
    <>
      {getCheckedOutBookingsQuery.isLoading ? (
        <div className="w-full text-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {bookings.length > 0 ? (
            <>
              <BookingsTable
                bookings={bookings}
                isLoading={false}
                hideActions
              />
            </>
          ) : (
            <div className="w-full">
              <div className="w-full flex flex-col items-center py-12 gap-4">
                <Image src="/Empty.svg" width={200} />
                <small>Bạn không có phiếu thuê cũ nào.</small>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
